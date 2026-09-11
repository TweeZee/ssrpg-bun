/**
 * The high-level interface to Stone Story RPG.
 *
 * @packageDocumentation
 */
import { MindConnectClient, type ClientOptions } from "./client";
import { ConnectionClosedError, ModeError } from "./errors";
import { PROTOCOL_VERSION } from "./protocol";
import type { CallValue, Mode, Request, Scalar, StepContext } from "./types";

import { CommandQueue, type PrintArg, type PrintOptions } from "./commands/command";
import { createAI, type AI } from "./commands/ai";
import { createArmor, type Armor } from "./commands/armor";
import { createPlayerBuffs, type PlayerBuffs } from "./commands/buffs";
import { createPlayerDebuffs, type PlayerDebuffs } from "./commands/debuffs";
import { createDraw, type Draw } from "./commands/draw";
import { createEncounter, type Encounter } from "./commands/encounter";
import { createEvent, type Event } from "./commands/event";
import { createFoe, type Foe } from "./commands/foe";
import { createHarvest, type Harvest } from "./commands/harvest";
import { createInput, type Input } from "./commands/input";
import { createItem, type Item } from "./commands/item";
import { createKey, type Key } from "./commands/key";
import { createLoc, type Loc } from "./commands/loc";
import { createPickup, type Pickup } from "./commands/pickup";
import { createPlayer, type Player } from "./commands/player";
import { createPosition, type Position } from "./commands/pos";
import { createResource, type Resource } from "./commands/res";
import { createScreen, type Screen } from "./commands/screen";
import { createStorage, type Storage } from "./commands/storage";
import { createSummon, type Summon } from "./commands/summon";
import { createText, type Text } from "./commands/te";
import { createVariable, type Variable } from "./commands/var";

/**
 * Options for {@link SSRPGInterface}.
 *
 * @remarks
 * Extends {@link ClientOptions}, so `hostname`, `port` and the two timeouts
 * can be set here too.
 */
export interface SSRPGInterfaceOptions extends ClientOptions {
  /**
   * Operation mode. Must match the `//MindConnect: [mode]` header on the first
   * line of the in-game Stonescript.
   *
   * @defaultValue `"sync"`
   */
  mode?: Mode;

  /**
   * Log a warning when the game reports a protocol version other than
   * {@link PROTOCOL_VERSION}.
   *
   * @remarks
   * Logged at most once per session, not once per frame.
   *
   * @defaultValue `true`
   */
  warnOnVersionMismatch?: boolean;
}

/**
 * A step callback: your script's logic for one half of a game frame.
 *
 * @remarks
 * Receives `pre` and `post` in `sync` mode and `exclusive` in `exclusive`
 * mode. It may be `async`; the game stays paused until it settles, so keep it
 * short.
 *
 * @param context - Which half of the frame this call is for.
 * @returns Nothing, or a promise to await before the queued commands are
 * flushed.
 */
export type StepFunction = (context: StepContext) => void | Promise<void>;

/** Options for {@link SSRPGInterface.run}. */
export interface RunOptions {
  /**
   * Signal that stops the loop.
   *
   * @remarks
   * Aborting disconnects, which unblocks the wait for the next frame and lets
   * {@link SSRPGInterface.run} return normally.
   */
  signal?: AbortSignal;
}

/** Every accepted {@link Mode}, used to validate the constructor option. */
const MODES: readonly Mode[] = ["sync", "async", "exclusive"];

/**
 * The high-level interface to Stone Story RPG.
 *
 * @remarks
 * Wraps a {@link MindConnectClient} with the three things a script wants:
 * typed accessors for the StoneScript namespaces, a per-step cache so
 * repeated reads are free, and a command queue that is flushed once per step.
 *
 * Everything that reads game state is `async`, because Bun sockets are
 * non-blocking. Everything that queues a command is synchronous — the request
 * only leaves when the step ends.
 *
 * @example
 * ```ts
 * const ssrpg = new SSRPGInterface({ mode: "sync" });
 * await ssrpg.connect();
 *
 * await ssrpg.run(async (context) => {
 *   if (context !== "pre") return;
 *   if (await ssrpg.loc.begin()) ssrpg.brew("tar", "wood");
 *   const distance = await ssrpg.foe.distance();
 *   if (distance !== null && distance < 8) ssrpg.activate("R");
 * });
 * ```
 *
 * @see {@link Mode} for how the modes differ.
 */
export class SSRPGInterface {
  /**
   * The MindConnect protocol version this class speaks.
   *
   * @see {@link PROTOCOL_VERSION}
   */
  static readonly PROTOCOL_VERSION = PROTOCOL_VERSION;

  readonly #client: MindConnectClient;
  readonly #mode: Mode;
  readonly #warnOnVersionMismatch: boolean;
  #versionWarned = false;

  /** Per-step memo of every cached call. Cleared at the start of each step. */
  readonly #cache = new Map<string, Promise<CallValue>>();

  /**
   * The queue holding this step's commands.
   *
   * @remarks
   * Every method is mirrored on the interface itself, so
   * `ssrpg.command.brew(...)` and `ssrpg.brew(...)` are the same call.
   */
  readonly command: CommandQueue;

  // --- StoneScript namespaces -------------------------------------------

  /** `ai` — state of the in-game auto-pilot. */
  readonly ai: AI;

  /** `armor` — the player's armour. */
  readonly armor: Armor;

  /** `buffs` — buffs currently on the player. */
  readonly buffs: PlayerBuffs;

  /** `debuffs` — debuffs currently on the player. */
  readonly debuffs: PlayerDebuffs;

  /** `draw` — direct drawing on the game screen. */
  readonly draw: Draw;

  /** `encounter` — information about the encounter in progress. */
  readonly encounter: Encounter;

  /** `event` — objectives of the active in-game event. */
  readonly event: Event;

  /** `foe` — the foe the player is currently targeting. */
  readonly foe: Foe;

  /** `harvest` — the nearest harvestable node. */
  readonly harvest: Harvest;

  /** `input` — the player's pointer position. */
  readonly input: Input;

  /** `item` — the player's equipped items and inventory. */
  readonly item: Item;

  /** `loc` — the location the player is currently in. */
  readonly loc: Loc;

  /** `pickup` — the nearest item lying on the ground. */
  readonly pickup: Pickup;

  /** `player` — the player character. */
  readonly player: Player;

  /** `pos` — the player's position in world coordinates. */
  readonly pos: Position;

  /** `res` — the player's carried resources. */
  readonly res: Resource;

  /** `screen` — the visible viewport and coordinate conversion. */
  readonly screen: Screen;

  /** `summon` — the player's active summons. */
  readonly summon: Summon;

  /** `var` — the Stonescript `var` dictionary shared with the in-game script. */
  readonly var: Variable;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly key: Key;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly storage: Storage;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly te: Text;

  /**
   * @param options - Mode and connection settings.
   * @throws {@link ModeError} when `options.mode` is not a valid {@link Mode}.
   */
  constructor(options: SSRPGInterfaceOptions = {}) {
    const mode = options.mode ?? "sync";
    if (!MODES.includes(mode)) {
      throw new ModeError(`Mode must be one of ${MODES.map((m) => `'${m}'`).join(", ")}.`);
    }

    this.#mode = mode;
    this.#warnOnVersionMismatch = options.warnOnVersionMismatch ?? true;
    this.#client = new MindConnectClient(options);
    this.command = new CommandQueue(this);

    this.ai = createAI(this);
    this.armor = createArmor(this);
    this.buffs = createPlayerBuffs(this);
    this.debuffs = createPlayerDebuffs(this);
    this.draw = createDraw(this);
    this.encounter = createEncounter(this);
    this.event = createEvent(this);
    this.foe = createFoe(this);
    this.harvest = createHarvest(this);
    this.input = createInput(this);
    this.item = createItem(this);
    this.loc = createLoc(this);
    this.pickup = createPickup(this);
    this.player = createPlayer(this);
    this.pos = createPosition(this);
    this.res = createResource(this);
    this.screen = createScreen(this);
    this.summon = createSummon(this);
    this.var = createVariable(this);
    this.key = createKey(this);
    this.storage = createStorage(this);
    this.te = createText(this);
  }

  /** The mode this interface was constructed with. */
  get mode(): Mode {
    return this.#mode;
  }

  /**
   * Whether the connection to the game is open.
   *
   * @see {@link SSRPGInterface.run}, which loops while this holds.
   */
  get connected(): boolean {
    return this.#client.connected;
  }

  /**
   * The underlying client, for protocol-level access.
   *
   * @remarks
   * Bypasses the cache, the command queue and the step lifecycle.
   */
  get client(): MindConnectClient {
    return this.#client;
  }

  // --- connection --------------------------------------------------------

  /**
   * Opens the connection to the game.
   *
   * @remarks
   * The game must be running with the mindstone enabled, a
   * `//MindConnect: [mode]` header matching {@link SSRPGInterface.mode} on the
   * first line of its Stonescript, and the player inside a location.
   *
   * @returns A promise that resolves once the connection is open.
   * @throws {@link ConnectFailedError} when the game cannot be reached.
   */
  async connect(): Promise<void> {
    await this.#client.connect();
  }

  /**
   * Closes the connection.
   *
   * @remarks
   * Safe to call more than once, and safe to call before connecting. Pending
   * requests and a pending {@link SSRPGInterface.step} reject with
   * {@link ConnectionClosedError}.
   */
  disconnect(): void {
    this.#client.close();
  }

  /**
   * Forgets every cached call.
   *
   * @remarks
   * Called automatically at the start of each step, so you only need this when
   * you drive {@link SSRPGInterface.call} outside the step lifecycle.
   */
  clearCache(): void {
    this.#cache.clear();
  }

  // --- stepping ----------------------------------------------------------

  /**
   * Runs one step: waits for the next frame signal, clears the cache and the
   * command queue, runs your callback, flushes the queued commands and hands
   * control back to the game.
   *
   * @remarks
   * The game is paused for the whole call, so a slow callback slows the game
   * down. Control is handed back even when the callback throws.
   *
   * @param stepFunction - Your logic for this step.
   * @returns The context the callback ran in.
   * @throws {@link ModeError} in `async` mode.
   * @throws {@link ConnectionClosedError} when the game disconnects while
   * waiting for the next frame.
   * @throws Whatever `stepFunction` throws.
   */
  async step(stepFunction: StepFunction): Promise<StepContext> {
    if (this.#mode === "async") {
      throw new ModeError("step() is only available in 'sync' and 'exclusive' modes.");
    }

    const signal = await this.#client.waitForSignal();
    this.#checkVersion(signal.version);

    this.#cache.clear();
    this.command.clear();

    try {
      await stepFunction(signal.context);
      await this.command.run();
    } finally {
      this.#client.sendEof();
    }

    return signal.context;
  }

  /**
   * Steps in a loop until the connection closes or the run is aborted.
   *
   * @remarks
   * A disconnect ends the loop normally rather than throwing, since the game
   * closing the connection — leaving a location, quitting — is the expected
   * way for a session to end. Any other error propagates.
   *
   * @param stepFunction - Your logic, called once per step.
   * @param options - Abort handling.
   * @returns A promise that resolves when the loop ends.
   * @throws {@link ModeError} in `async` mode.
   * @throws Whatever `stepFunction` throws.
   *
   * @example
   * ```ts
   * const controller = new AbortController();
   * process.on("SIGINT", () => controller.abort());
   * await ssrpg.run(step, { signal: controller.signal });
   * ```
   */
  async run(stepFunction: StepFunction, options: RunOptions = {}): Promise<void> {
    const { signal } = options;
    const onAbort = (): void => this.disconnect();
    signal?.addEventListener("abort", onAbort, { once: true });

    try {
      while (this.connected && !signal?.aborted) {
        try {
          await this.step(stepFunction);
        } catch (error) {
          if (error instanceof ConnectionClosedError) return;
          throw error;
        }
      }
    } finally {
      signal?.removeEventListener("abort", onAbort);
    }
  }

  // --- low-level API -----------------------------------------------------

  /**
   * Reads a variable or calls a function.
   *
   * @remarks
   * The result is memoised for the rest of the current step, so repeated reads
   * of the same value cost one round trip. Concurrent reads share the pending
   * promise rather than issuing a second request. A failed call is evicted, so
   * it can be retried.
   *
   * Do not use this for anything with side effects — use
   * {@link SSRPGInterface.callUncached} instead, or the cache will swallow the
   * second call.
   *
   * @param command - Fully qualified StoneScript name, e.g. `foe.name`.
   * @param args - Arguments to pass to the function.
   * @returns The value, converted by {@link autoCast}.
   *
   * @example
   * ```ts
   * const foeName = await ssrpg.call("foe.name");
   * const symbol = await ssrpg.call("draw.GetSymbol", 10, 5);
   * ```
   */
  call(command: string, ...args: Scalar[]): Promise<CallValue> {
    const key = JSON.stringify([command, ...args]);
    const cached = this.#cache.get(key);
    if (cached) return cached;

    const pending = this.callUncached(command, ...args);
    this.#cache.set(key, pending);
    pending.catch(() => this.#cache.delete(key));
    return pending;
  }

  /**
   * Reads a variable or calls a function, bypassing the cache entirely.
   *
   * @remarks
   * The right choice for calls with side effects and for values the in-game
   * script can change mid-step.
   *
   * @param command - Fully qualified StoneScript name, e.g. `var.get`.
   * @param args - Arguments to pass to the function.
   * @returns The value, converted by {@link autoCast}.
   */
  async callUncached(command: string, ...args: Scalar[]): Promise<CallValue> {
    const values = await this.#client.sendAndReceive([[command, ...args]]);
    return values.length > 0 ? values[0]! : null;
  }

  /**
   * Sends several requests in a single round trip.
   *
   * @remarks
   * Never cached, in either direction. This is the cheapest way to read a lot
   * of state at once, since one packet replaces one round trip per value.
   *
   * @param requests - The batch to send.
   * @returns One value per request, in order.
   *
   * @example
   * ```ts
   * const [name, id, symbol] = await ssrpg.multiCall([
   *   ["foe.name"],
   *   ["loc.id"],
   *   ["draw.GetSymbol", 10, 5],
   * ]);
   * // -> ["Wound Licker", "caustic_caves", "-"]
   * ```
   */
  async multiCall(requests: readonly Request[]): Promise<CallValue[]> {
    return this.#client.sendAndReceive(requests);
  }

  /**
   * Fire-and-forget request for `async` mode.
   *
   * @remarks
   * Present for parity with the Python library. In Bun every call is already a
   * promise, so {@link SSRPGInterface.multiCall} is usually what you want.
   *
   * @param requests - The batch to send.
   * @param callback - Node-style callback: an error and no values, or `null`
   * and one value per request.
   * @throws {@link ModeError} outside `async` mode.
   */
  callAsync(
    requests: readonly Request[],
    callback: (error: unknown | null, values: CallValue[]) => void,
  ): void {
    if (this.#mode !== "async") {
      throw new ModeError("callAsync() is only available in 'async' mode.");
    }
    void this.#client.sendAndReceive(requests).then(
      (values) => callback(null, values),
      (error) => callback(error, []),
    );
  }

  /**
   * Queues a request to be sent when the current step ends.
   *
   * @param command - Fully qualified StoneScript name, e.g. `loc.Pause`.
   * @param args - Arguments to pass along.
   */
  queue(command: string, ...args: Scalar[]): void {
    this.command.push(command, ...args);
  }

  /**
   * Reads a rectangular block of the screen as text.
   *
   * @remarks
   * Issues one `draw.GetSymbol` per cell, batched into a single round trip.
   *
   * @param x - Screen column of the top-left cell.
   * @param y - Screen row of the top-left cell.
   * @param w - Width in cells. A non-positive value yields an empty string.
   * @param h - Height in cells. A non-positive value yields an empty string.
   * @returns The block, one line per row, with empty cells as spaces.
   *
   * @example
   * ```ts
   * console.log(await ssrpg.getScreen(0, 0, 40, 20));
   * ```
   */
  async getScreen(x: number, y: number, w: number, h: number): Promise<string> {
    if (w <= 0 || h <= 0) return "";

    const requests: Request[] = [];
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        requests.push(["draw.GetSymbol", x + col, y + row]);
      }
    }

    const symbols = (await this.multiCall(requests)).map((value) =>
      value === null ? " " : String(value),
    );

    const lines: string[] = [];
    for (let offset = 0; offset < symbols.length; offset += w) {
      lines.push(symbols.slice(offset, offset + w).join(""));
    }
    return lines.join("\n");
  }

  // --- top-level StoneScript variables -----------------------------------

  /**
   * Reads `time`.
   *
   * @returns Frames elapsed in the current location.
   */
  time(): Promise<number | null> {
    return this.#int("time");
  }

  /**
   * Reads `totaltime`.
   *
   * @returns Frames elapsed since the run started.
   */
  totaltime(): Promise<number | null> {
    return this.#int("totaltime");
  }

  /**
   * Reads `hp`.
   *
   * @returns The player's current health.
   */
  hp(): Promise<number | null> {
    return this.#int("hp");
  }

  /**
   * Reads `maxhp`.
   *
   * @returns The player's maximum health.
   */
  maxhp(): Promise<number | null> {
    return this.#int("maxhp");
  }

  /**
   * Reads `maxarmor`.
   *
   * @returns The player's maximum armour.
   *
   * @see {@link SSRPGInterface.armor} for the current value.
   */
  maxarmor(): Promise<number | null> {
    return this.#int("maxarmor");
  }

  /**
   * Reads `face`.
   *
   * @returns The player's current facial expression.
   */
  async face(): Promise<string | null> {
    const value = await this.call("face");
    return value === null ? null : String(value);
  }

  /**
   * Reads `bighead`.
   *
   * @returns Whether big-head mode is on.
   */
  async bighead(): Promise<boolean> {
    return (await this.call("bighead")) === true;
  }

  /**
   * Reads `totalgp`.
   *
   * @returns Total gold pieces collected.
   *
   * @see {@link Loc.gp} for this location alone.
   */
  totalgp(): Promise<number | null> {
    return this.#int("totalgp");
  }

  // --- queued command shorthands -----------------------------------------

  /**
   * Queues `>` — prints text to the screen.
   *
   * @param text - What to print; an array is concatenated without a separator.
   * @param options - Where and how to draw it.
   *
   * @see {@link CommandQueue.print}
   */
  print(text: PrintArg | readonly PrintArg[], options?: PrintOptions): void {
    this.command.print(text, options);
  }

  /**
   * Queues `play` — plays a sound.
   *
   * @param args - Sound name and any modifiers.
   *
   * @see {@link CommandQueue.play}
   */
  play(...args: PrintArg[]): void {
    this.command.play(...args);
  }

  /**
   * Queues `equipR` — equips items to the right hand.
   *
   * @param items - Item names, in order of preference.
   *
   * @see {@link CommandQueue.equipR}
   */
  equipR(...items: string[]): void {
    this.command.equipR(...items);
  }

  /**
   * Queues `equipL` — equips items to the left hand.
   *
   * @param items - Item names, in order of preference.
   *
   * @see {@link CommandQueue.equipL}
   */
  equipL(...items: string[]): void {
    this.command.equipL(...items);
  }

  /**
   * Queues `equip` — equips items to whichever hand fits best.
   *
   * @param items - Item names, in order of preference.
   *
   * @see {@link CommandQueue.equip}
   */
  equip(...items: string[]): void {
    this.command.equip(...items);
  }

  /**
   * Queues `loadout` — switches to a saved loadout.
   *
   * @param index - The loadout slot to switch to.
   *
   * @see {@link CommandQueue.loadout}
   */
  loadout(index: number): void {
    this.command.loadout(index);
  }

  /**
   * Queues `activate` — activates the item in the given hand.
   *
   * @param args - `"R"` or `"L"`, plus any modifiers.
   *
   * @see {@link CommandQueue.activate}, {@link Item.CanActivate}
   */
  activate(...args: PrintArg[]): void {
    this.command.activate(...args);
  }

  /**
   * Queues `enable` — enables items or abilities.
   *
   * @param names - Item or ability names.
   *
   * @see {@link CommandQueue.enable}
   */
  enable(...names: string[]): void {
    this.command.enable(...names);
  }

  /**
   * Queues `disable` — disables items or abilities.
   *
   * @param names - Item or ability names.
   *
   * @see {@link CommandQueue.disable}
   */
  disable(...names: string[]): void {
    this.command.disable(...names);
  }

  /**
   * Queues `brew` — brews a potion from the given materials.
   *
   * @param materials - Material names, joined with `+` for the game.
   *
   * @see {@link CommandQueue.brew}, {@link Item.potion}
   */
  brew(...materials: string[]): void {
    this.command.brew(...materials);
  }

  // --- internals ---------------------------------------------------------

  /**
   * Reads a top-level variable as an integer.
   *
   * @param name - Variable name, e.g. `hp`.
   * @returns The number, or `null` when the value is absent or not an integer.
   */
  async #int(name: string): Promise<number | null> {
    const value = await this.call(name);
    return typeof value === "number" ? value : null;
  }

  /**
   * Warns once if the game speaks a different protocol version.
   *
   * @param version - Version the game reported in its step signal.
   */
  #checkVersion(version: string): void {
    if (!this.#warnOnVersionMismatch || this.#versionWarned) return;
    if (version === PROTOCOL_VERSION) return;
    this.#versionWarned = true;
    console.warn(
      `[ssrpg] Protocol version mismatch: client speaks v${PROTOCOL_VERSION}, game reports v${version}.`,
    );
  }
}
