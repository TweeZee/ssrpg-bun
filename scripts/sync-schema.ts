#!/usr/bin/env bun
/**
 * Regenerates the StoneScript schema from the official manual.
 *
 * @remarks
 * Three jobs, in order:
 *
 * 1. Rewrites `src/schema/ids.ts` from the manual's appendices. Fully
 *    generated — never hand-edit it.
 * 2. Refreshes the per-member descriptions in `src/schema/api.ts`. Only doc
 *    blocks carrying the generated `@see ... in the Stonescript manual.` tag
 *    are touched; hand-written ones are left alone.
 * 3. Reports drift between the manual and {@link StoneScriptAPI} — members the
 *    manual has that the registry lacks, members the registry has that the
 *    manual no longer documents, and return types that disagree. The registry's
 *    argument lists and template-literal families need judgement, so this
 *    reports rather than rewrites.
 *
 * The keys are read by expanding `keyof StoneScriptAPI` with the TypeScript
 * compiler, so the families are covered as well as the explicit entries.
 *
 * ```
 * bun run schema:sync                  # fetch and regenerate
 * bun run schema:check                 # fail if anything is stale or drifted
 * bun run schema:sync --from page.html # use a local copy of the manual
 * ```
 *
 * @packageDocumentation
 */
import { parseArgs } from "node:util";
import { resolve } from "node:path";
import ts from "typescript";

/** Where the beta manual lives. */
const MANUAL_URL = "https://stonestoryrpg.com/stonescript/beta.html";

/** Generated file, rewritten wholesale. */
const IDS_PATH = "src/schema/ids.ts";

/** Hand-maintained file whose generated doc blocks are refreshed. */
const API_PATH = "src/schema/api.ts";

/** Marks a doc block this script owns and may rewrite. */
const GENERATED_DOC_TAG = "in the Stonescript manual.";

/**
 * Members the registry deliberately leaves out, and why.
 *
 * @remarks
 * MindConnect carries integers, booleans and strings, so anything returning a
 * StoneScript object has no way home.
 */
const NOT_IN_REGISTRY: Readonly<Record<string, string>> = {
  "math.BigNumber": "returns a BigNumber object",
  "ui.AddAnim": "returns an Anim object",
  "ui.AddButton": "returns a Button object",
  "ui.AddPanel": "returns a Panel object",
  "ui.AddStyle": "part of the UI object system",
  "ui.AddText": "returns a Text object",
  "anim.AddLayer": "returns an Anim object",
  "canvas.Get": "part of the UI object system",
  "string.Join": "takes an array, which the protocol cannot send",
  "ui.root": "returns a Panel object",
  "sys.MindConnect": "enables the server side of this very protocol",
};

/** Registry keys with no counterpart in the manual, and why. */
const NOT_IN_MANUAL: Readonly<Record<string, string>> = {
  "var.get": "MindConnect accessor for the Stonescript var dictionary",
  "var.set": "MindConnect accessor for the Stonescript var dictionary",
  "var.has": "MindConnect accessor for the Stonescript var dictionary",
};

/** The ten queued commands, documented in the manual's Commands section. */
const COMMAND_NAMES = new Set([
  ">",
  "play",
  "equip",
  "equipL",
  "equipR",
  "loadout",
  "activate",
  "enable",
  "disable",
  "brew",
]);

/** Prefixes whose members are instance methods on an object, not namespaces. */
const OBJECT_PREFIXES = [
  "a.",
  "b.",
  "anim.",
  "canvas.",
  "component.",
  "panel.",
  "button.",
  "text.",
  "style.",
];

/** Top-level variables the manual documents without a dot in the name. */
const TOP_LEVEL_MEMBERS = new Set([
  "hp",
  "maxhp",
  "maxarmor",
  "armor",
  "foe",
  "loc",
  "harvest",
  "pickup",
  "key",
  "face",
  "bighead",
  "totalgp",
  "time",
  "totaltime",
  "rng",
  "rngf",
  "music",
  "ambient",
  "Type",
]);

/** Maps the manual's return wording onto the registry's marker types. */
const RETURN_MARKERS: Readonly<Record<string, readonly string[]>> = {
  int: ["number"],
  integer: ["number"],
  number: ["Decimal", "number"],
  float: ["Float", "Decimal"],
  string: ["string", "Color", "Joined"],
  str: ["string"],
  bool: ["boolean"],
  boolean: ["boolean"],
  value: ["StoredValue"],
  array: ["Joined"],
  "int[3]": ["Joined"],
};

/** The identifier lists the manual keeps in its appendices. */
interface ManualIds {
  ability: string[];
  sounds: string[];
  music: string[];
  ambient: string[];
  keyActions: string[];
  keyNames: string[];
  searchFilters: string[];
}

/** Everything this script reads out of the manual. */
interface Manual {
  version: string;
  date: string;
  ids: ManualIds;
  /** Member name to its first documented sentence. */
  descriptions: Map<string, string>;
  /** Member name to the return type the manual annotates it with. */
  returns: Map<string, string>;
  /** Every name the manual documents as a readable or callable member. */
  members: Set<string>;
}

// --- html ---------------------------------------------------------------

/** Decodes the handful of entities the manual uses. */
function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * Turns a fragment of the manual into plain text.
 *
 * @param html - The fragment.
 * @param options - `keepExamples` retains the `<eg>` blocks the manual uses for
 * inline examples; they are dropped by default.
 * @returns The text, with `<br>` as newlines.
 */
function toText(html: string, options: { keepExamples?: boolean } = {}): string {
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  if (!options.keepExamples) text = text.replace(/<eg>[\s\S]*/i, "");
  return decodeEntities(text.replace(/<[^>]+>/g, ""));
}

/**
 * Extracts one `<div id="...">` section, up to the next section separator.
 *
 * @param html - The whole page.
 * @param id - The section id, e.g. `native-functions`.
 * @returns The section's html, or an empty string when it is missing.
 */
function section(html: string, id: string): string {
  const pattern = new RegExp(
    `<div id="${id}">([\\s\\S]*?)(?=<div id="[a-z_-]+"><div id="separator")`,
  );
  return pattern.exec(html)?.[1] ?? "";
}

/**
 * Splits a fragment into table rows of cells.
 *
 * @remarks
 * The manual's markup is handwritten and has a few rows missing their opening
 * `<tr>` or a cell missing its `</td>`. Splitting on either tag and accepting
 * any chunk with two cells tolerates both — a stricter parser silently drops
 * those members.
 *
 * @param html - The fragment to scan.
 * @returns One array of raw cell html per row.
 */
function tableRows(html: string): string[][] {
  const rows: string[][] = [];
  for (const chunk of html.split(/<\/?tr>/)) {
    const cells = chunk
      .split(/<td[^>]*>/)
      .slice(1)
      .map((cell) => cell.split("</td>")[0]!);
    if (cells.length >= 2) rows.push(cells);
  }
  return rows;
}

/** Pulls the identifier list out of an appendix that lists them one per line. */
function appendixIds(html: string, id: string, marker: string): string[] {
  const lines = toText(section(html, id), { keepExamples: true }).split("\n");
  const start = lines.findIndex((line) => line.includes(marker));
  const found = new Set<string>();
  for (const line of lines.slice(start + 1)) {
    const value = line.trim();
    if (/^[a-z][a-z0-9_]{2,}$/.test(value)) found.add(value);
  }
  return [...found];
}

// --- extraction ---------------------------------------------------------

/**
 * Pulls every member name out of a signature cell.
 *
 * @remarks
 * A cell can hold several signatures, one per line, and the manual sometimes
 * groups them on one comma-separated line (`time.year, time.month, ...`). The
 * inline `<eg>Returns ...` annotation sits between signatures rather than
 * after them, so it is removed in place instead of truncating the cell.
 *
 * @param cell - The raw html of a row's first cell.
 * @returns The member names it documents.
 */
function signatureNames(cell: string): string[] {
  const names: string[] = [];
  for (const line of toText(cell.replace(/<eg>[\s\S]*/i, ""), { keepExamples: true }).split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // A signature's own parentheses may contain commas, so only split a line
    // into several names when it has no argument list.
    // `disable hud (opts)` and friends document the command by its first word.
    const head = trimmed.split(/[\s(]/)[0]!;
    if (COMMAND_NAMES.has(head)) {
      names.push(head);
      continue;
    }
    const parts = trimmed.includes("(") ? [trimmed.split("(")[0]!] : trimmed.split(",");
    for (const part of parts) {
      const name = part.replace(/^\?/, "").trim().replace(/[,:]$/, "");
      if (name) names.push(name);
    }
  }
  return names;
}

/** The signatures an annotation applies to, and the annotation itself. */
interface SignatureGroup {
  names: string[];
  returns?: string;
}

/**
 * Splits a signature cell into groups by their `Returns` annotation.
 *
 * @remarks
 * A cell can document several members with different return types — the
 * annotation sits after the signatures it applies to, not at the end of the
 * cell — so each annotation claims the signatures before it.
 *
 * @param cell - The raw html of a row's first cell.
 * @returns One group per annotation, plus any trailing unannotated signatures.
 */
function signatureGroups(cell: string): SignatureGroup[] {
  const annotation = /<eg>\s*(?:Returns?\s+([^<\n]+)|No return value)/gi;
  const groups: SignatureGroup[] = [];
  let cursor = 0;

  for (const match of cell.matchAll(annotation)) {
    const names = signatureNames(cell.slice(cursor, match.index));
    if (names.length > 0) groups.push({ names, returns: match[1]?.trim() });
    cursor = match.index + match[0].length;
  }

  const trailing = signatureNames(cell.slice(cursor));
  if (trailing.length > 0) groups.push({ names: trailing });
  return groups;
}

/**
 * Reads the manual into the shape the generators want.
 *
 * @param html - The manual's html.
 * @returns Identifier lists, member descriptions, return types and names.
 * @throws When the page does not look like the manual.
 */
function parseManual(html: string): Manual {
  const stamp = /v(\d+\.\d+\.\d+) - (\d{4}\/\d{2}\/\d{2})/.exec(html);
  if (!stamp) throw new Error("Could not find the manual's version stamp — is this the right page?");

  const descriptions = new Map<string, string>();
  const returns = new Map<string, string>();
  const members = new Set<string>();

  for (const cells of tableRows(html)) {
    const body = toText(cells[1]!).replace(/\s+/g, " ").trim();
    const sentence = /^(.{0,220}?[.!])(\s|$)/.exec(body)?.[1]?.trim() ?? body.slice(0, 220);

    for (const group of signatureGroups(cells[0]!)) {
      for (const name of group.names) {
        if (!/^[A-Za-z][A-Za-z0-9_.]*$/.test(name) && !COMMAND_NAMES.has(name)) continue;
        if (!name.includes(".") && !TOP_LEVEL_MEMBERS.has(name) && !COMMAND_NAMES.has(name)) continue;
        if (OBJECT_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;

        members.add(name);
        if (sentence.endsWith(".") && sentence.split(" ").length >= 4 && !descriptions.has(name)) {
          descriptions.set(name, sentence);
        }
        if (group.returns && !returns.has(name)) returns.set(name, group.returns.toLowerCase());
      }
    }
  }

  const keyRows = tableRows(section(html, "native-functions").split("key.Bind")[0]!);
  const keySequence = keyRows
    .map((cells) => toText(cells[0]!).trim())
    .filter((value) => /^[A-Z][A-Za-z0-9]*$/.test(value));
  const keyActions = KEY_ACTIONS.filter((action) => keySequence.includes(action));
  if (keyActions.length !== KEY_ACTIONS.length) {
    const missing = KEY_ACTIONS.filter((action) => !keySequence.includes(action));
    throw new Error(`The manual no longer documents these key actions: ${missing.join(", ")}`);
  }
  // Primary keys sit in the second column and secondary keys in a third.
  const keyNames = keyRows
    .flatMap((cells) => cells.slice(1).flatMap((cell) => toText(cell).split("\n")))
    .map((value) => value.trim())
    .filter(
      (value) =>
        /^[A-Z][A-Za-z0-9]*$/.test(value) &&
        !(KEY_ACTIONS as readonly string[]).includes(value),
    );

  const filterLines = toText(section(html, "search-filters"), { keepExamples: true }).split("\n");
  const searchFilters = filterLines
    .map((line) => line.trim())
    .filter((line) => /^[a-z][a-z0-9_]{2,}$/.test(line) && !line.startsWith("loadout"));

  return {
    version: stamp[1]!,
    date: stamp[2]!,
    descriptions,
    returns,
    members,
    ids: {
      ability: [
        ...new Set(
          [...section(html, "ability_ids").matchAll(/"([a-z][a-z0-9_]+)"/g)].map((m) => m[1]!),
        ),
      ]
        .filter((id) => id !== "separator")
        .sort(),
      sounds: appendixIds(html, "sounds", "full list of sounds"),
      music: appendixIds(html, "music", "full list of music"),
      ambient: appendixIds(html, "ambient", "full list of ambient"),
      keyActions,
      keyNames: [...new Set(keyNames)],
      searchFilters: [...new Set(searchFilters)],
    },
  };
}

/**
 * The bindable actions, in the manual's own order.
 *
 * @remarks
 * A closed set, so it is asserted against the manual rather than scraped from
 * it: the action names share a table with their default keys, and only the
 * order tells them apart.
 */
const KEY_ACTIONS = [
  "Pause",
  "Leave",
  "Inventory",
  "Mindstone",
  "Potion",
  "ItemLeft",
  "ItemRight",
  "Up",
  "Down",
  "Left",
  "Right",
  "Primary",
  "Back",
  "Ability1",
  "Ability2",
  "BumpL",
  "BumpR",
  "Dynamic1",
  "Dynamic2",
  "Dynamic3",
  "Dynamic4",
  "Dynamic5",
] as const;

// --- generation ---------------------------------------------------------

/** Renders a literal-union type alias. */
function renderUnion(name: string, values: readonly string[], doc: string): string {
  const body = values.map((value) => `  | "${value}"`).join("\n");
  return `/**\n * ${doc}\n */\nexport type ${name} =\n${body};\n`;
}

/**
 * Renders the whole of `src/schema/ids.ts`.
 *
 * @param manual - The parsed manual.
 * @returns The file's contents.
 */
function renderIds(manual: Manual): string {
  const { ids } = manual;
  const header = `/**
 * Identifier unions generated from the StoneScript reference.
 *
 * @remarks
 * Extracted from {@link ${MANUAL_URL} | the
 * Stonescript manual} (beta, v${manual.version} — ${manual.date}) by
 * \`bun run schema:sync\`. Do not hand-edit; regenerate.
 *
 * Sets the game can extend are wrapped in {@link Loose} at the point of use,
 * so the documented values autocomplete while any other string is accepted.
 *
 * @packageDocumentation
 */

/**
 * Widens a literal union so unknown values are still accepted, without losing
 * autocompletion for the documented ones.
 *
 * @remarks
 * The \`string & {}\` half is what stops the editor collapsing the union down
 * to plain \`string\`.
 *
 * @typeParam T - The documented values.
 *
 * @example
 * \`\`\`ts
 * declare function play(sound: Loose<SoundId>): void;
 * play("bat_wing");   // autocompleted
 * play("new_sound");  // still allowed
 * \`\`\`
 */
export type Loose<T extends string> = T | (string & {});
`;

  return [
    header,
    renderUnion(
      "AbilityId",
      ids.ability,
      "Ability cooldown ids, used by `item.GetCooldown` and the `activate` command.\n *\n * @see Appendix A of the Stonescript manual.",
    ),
    renderUnion(
      "SoundId",
      ids.sounds,
      "Sound effect ids, used by the `play` command.\n *\n * @see Appendix B of the Stonescript manual.",
    ),
    renderUnion(
      "MusicId",
      ids.music,
      "Music track ids, used by `music.Play`.\n *\n * @see Appendix C of the Stonescript manual.",
    ),
    renderUnion(
      "AmbientId",
      ids.ambient,
      "Ambient audio loop ids, used by `ambient.Add`.\n *\n * @see Appendix D of the Stonescript manual.",
    ),
    renderUnion(
      "KeyAction",
      ids.keyActions,
      "Bindable input actions, used by the `key` namespace.\n *\n * @remarks\n * A closed set: the game defines exactly these actions.",
    ),
    renderUnion(
      "KeyName",
      [...ids.keyNames].sort(),
      "Key names the manual lists as defaults.\n *\n * @remarks\n * Key names follow the engine's own naming, so this is the documented subset\n * rather than every accepted value — use it through {@link Loose}.",
    ),
    renderUnion(
      "SearchFilter",
      ids.searchFilters,
      "Tags accepted by the item and foe search filters.\n *\n * @see The Search Filters section of the Stonescript manual.",
    ),
  ].join("\n");
}

/** Wraps a description into a doc comment body at the registry's indent. */
function wrapDoc(text: string, name: string): string {
  const lines: string[] = [];
  let current = "   *";
  for (const word of text.replace(/\*\//g, "*\\/").split(/\s+/)) {
    if (current.length + word.length + 1 > 78) {
      lines.push(current);
      current = `   * ${word}`;
    } else {
      current = `${current} ${word}`;
    }
  }
  lines.push(current);
  return ["  /**", ...lines, "   *", `   * @see \`${name}\` in the ${"Stonescript manual"}.`, "   */"].join(
    "\n",
  );
}

/** One explicit entry of the registry, as it appears in the source. */
interface RegistryEntry {
  name: string;
  /** The declared shape, e.g. `Read<number>`. */
  declaration: string;
  /** Index of the entry's own line. */
  line: number;
  /** Whether a doc block this script owns sits above it. */
  hasGeneratedDoc: boolean;
  /** Whether any doc block sits above it. */
  hasDoc: boolean;
  /** Line range of an owned doc block, for replacement. */
  docRange?: [number, number];
}

/**
 * Finds the registry's explicit entries and the doc blocks above them.
 *
 * @param lines - `src/schema/api.ts`, split into lines.
 * @returns One record per entry, in source order.
 */
function findEntries(lines: readonly string[]): RegistryEntry[] {
  const entries: RegistryEntry[] = [];
  let inRegistry = false;

  for (const [index, line] of lines.entries()) {
    if (/^export interface StoneScript(API|Commands)/.test(line)) inRegistry = true;
    if (!inRegistry) continue;

    const match = /^ {2}("?)([A-Za-z][A-Za-z0-9_.]*)\1: ((?:Read|Fn|Act)[<;][\s\S]*)/.exec(line);
    if (!match) continue;

    // Walk back over a doc block, if there is one.
    let hasDoc = false;
    let hasGeneratedDoc = false;
    let docRange: [number, number] | undefined;
    if (lines[index - 1]?.trim() === "*/") {
      const start = lines.lastIndexOf("  /**", index);
      if (start !== -1) {
        hasDoc = true;
        const block = lines.slice(start, index).join("\n");
        hasGeneratedDoc = block.includes(GENERATED_DOC_TAG);
        if (hasGeneratedDoc) docRange = [start, index - 1];
      }
    }

    entries.push({
      name: match[2]!,
      declaration: match[3]!,
      line: index,
      hasDoc,
      hasGeneratedDoc,
      docRange,
    });
  }

  return entries;
}

/** What a description refresh changed. */
interface DocRefresh {
  source: string;
  added: string[];
  updated: string[];
  removed: string[];
}

/**
 * Rewrites the generated doc blocks in the registry.
 *
 * @remarks
 * Idempotent, and leaves hand-written doc blocks untouched — a block is only
 * rewritten when it carries the generated tag.
 *
 * @param source - The current contents of `src/schema/api.ts`.
 * @param manual - The parsed manual.
 * @returns The new contents plus what changed.
 */
function refreshApiDocs(source: string, manual: Manual): DocRefresh {
  const lines = source.split("\n");
  const entries = findEntries(lines);
  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];

  // Rewrite from the bottom so earlier line numbers stay valid.
  for (const entry of [...entries].reverse()) {
    const description = manual.descriptions.get(entry.name);

    if (entry.hasGeneratedDoc && entry.docRange) {
      const [start, end] = entry.docRange;
      if (description) {
        const replacement = wrapDoc(description, entry.name);
        if (lines.slice(start, end + 1).join("\n") !== replacement) updated.push(entry.name);
        lines.splice(start, end - start + 1, replacement);
      } else {
        lines.splice(start, end - start + 1);
        removed.push(entry.name);
      }
      continue;
    }

    if (!entry.hasDoc && description) {
      lines.splice(entry.line, 0, wrapDoc(description, entry.name));
      added.push(entry.name);
    }
  }

  return { source: lines.join("\n"), added, updated, removed };
}

// --- drift --------------------------------------------------------------

/**
 * Expands `keyof StoneScriptAPI` with the TypeScript compiler.
 *
 * @remarks
 * Reading the source with a regex would only find the explicit entries; the
 * template-literal families have to be resolved by the type checker.
 *
 * @param apiPath - Path to the registry module.
 * @returns Every member name the registry knows.
 * @throws When the registry interface cannot be found.
 */
function registryKeys(apiPath: string): Set<string> {
  const configPath = ts.findConfigFile(".", ts.sys.fileExists, "tsconfig.json");
  if (!configPath) throw new Error("Could not find tsconfig.json.");

  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ".");
  const program = ts.createProgram({
    rootNames: [apiPath],
    options: { ...parsed.options, noEmit: true },
  });

  const source = program.getSourceFile(apiPath);
  if (!source) throw new Error(`Could not load ${apiPath}.`);
  const checker = program.getTypeChecker();

  const keys = new Set<string>();
  for (const statement of source.statements) {
    if (!ts.isInterfaceDeclaration(statement)) continue;
    if (!/^StoneScript(API|Commands)$/.test(statement.name.text)) continue;
    for (const property of checker.getTypeAtLocation(statement.name).getProperties()) {
      keys.add(property.name);
    }
  }

  if (keys.size === 0) throw new Error("Found no members on StoneScriptAPI.");
  return keys;
}

/** A single disagreement between the manual and the registry. */
interface Drift {
  kind: "missing" | "extra" | "returns";
  name: string;
  detail: string;
}

/**
 * Compares the manual against the registry.
 *
 * @param manual - The parsed manual.
 * @param source - The current contents of `src/schema/api.ts`.
 * @param keys - The registry's expanded member names.
 * @returns Every disagreement that is not in one of the allowlists.
 */
function findDrift(manual: Manual, source: string, keys: Set<string>): Drift[] {
  const drift: Drift[] = [];

  for (const name of [...manual.members].sort()) {
    if (keys.has(name) || name in NOT_IN_REGISTRY) continue;
    drift.push({
      kind: "missing",
      name,
      detail: manual.descriptions.get(name) ?? "documented in the manual",
    });
  }

  for (const name of [...keys].sort()) {
    if (manual.members.has(name) || name in NOT_IN_MANUAL) continue;
    drift.push({ kind: "extra", name, detail: "not documented in the manual" });
  }

  for (const entry of findEntries(source.split("\n"))) {
    const declared = manual.returns.get(entry.name);
    if (!declared) continue;
    const expected = RETURN_MARKERS[declared];
    if (!expected) continue;
    const marker = /^(?:Read|Fn|Act)<(?:[\s\S]*,\s*)?([A-Za-z]+)>/.exec(entry.declaration)?.[1];
    if (marker && !expected.includes(marker)) {
      drift.push({
        kind: "returns",
        name: entry.name,
        detail: `manual says "${declared}", registry says ${marker}`,
      });
    }
  }

  return drift;
}

// --- entry point --------------------------------------------------------

/** Fetches the manual, or reads a local copy. */
async function loadManual(options: { from?: string; url: string }): Promise<string> {
  if (options.from) return Bun.file(options.from).text();

  const response = await fetch(options.url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) {
    throw new Error(`Could not fetch ${options.url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

/** Writes a file only when its contents changed. */
async function writeIfChanged(path: string, contents: string): Promise<boolean> {
  const file = Bun.file(path);
  if ((await file.exists()) && (await file.text()) === contents) return false;
  await Bun.write(path, contents);
  return true;
}

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    check: { type: "boolean", default: false },
    from: { type: "string" },
    url: { type: "string", default: MANUAL_URL },
  },
});

const manual = parseManual(await loadManual({ from: values.from, url: values.url! }));
console.log(
  `Stonescript manual v${manual.version} (${manual.date}) — ` +
    `${manual.members.size} members, ${manual.descriptions.size} descriptions`,
);

const idsSource = renderIds(manual);
const currentApi = await Bun.file(API_PATH).text();
const refresh = refreshApiDocs(currentApi, manual);

const idsStale = (await Bun.file(IDS_PATH).text()) !== idsSource;
const apiStale = refresh.source !== currentApi;

if (values.check) {
  if (idsStale) console.error(`✗ ${IDS_PATH} is out of date — run: bun run schema:sync`);
  if (apiStale) console.error(`✗ ${API_PATH} descriptions are out of date — run: bun run schema:sync`);
} else {
  if (await writeIfChanged(IDS_PATH, idsSource)) console.log(`✓ wrote ${IDS_PATH}`);
  else console.log(`· ${IDS_PATH} already current`);

  if (await writeIfChanged(API_PATH, refresh.source)) {
    console.log(
      `✓ wrote ${API_PATH} (+${refresh.added.length} ~${refresh.updated.length} -${refresh.removed.length} descriptions)`,
    );
    for (const name of refresh.added) console.log(`    + ${name}`);
    for (const name of refresh.updated) console.log(`    ~ ${name}`);
    for (const name of refresh.removed) console.log(`    - ${name}`);
  } else {
    console.log(`· ${API_PATH} descriptions already current`);
  }
}

const drift = findDrift(manual, values.check ? currentApi : refresh.source, registryKeys(resolve(API_PATH)));

if (drift.length === 0) {
  console.log("✓ no drift: the registry matches the manual");
} else {
  console.log(`\n${drift.length} item(s) need a decision — the registry is hand-maintained:`);
  for (const item of drift) {
    const symbol = item.kind === "missing" ? "+" : item.kind === "extra" ? "-" : "!";
    console.log(`  ${symbol} ${item.name}: ${item.detail}`);
  }
  console.log(
    "\nAdd the member to StoneScriptAPI, or record why it is excluded in " +
      "NOT_IN_REGISTRY / NOT_IN_MANUAL in this script.",
  );
}

if (values.check && (idsStale || apiStale || drift.length > 0)) process.exit(1);
