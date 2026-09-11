/**
 * The command queue.
 *
 * @remarks
 * Commands are collected during a step and flushed to the game as a single
 * request batch when the step callback returns, which is why queueing is
 * synchronous while everything that reads game state is `async`.
 *
 * @packageDocumentation
 */
import type { CallValue, Request, Scalar } from "../types";

/**
 * Anything that can be printed.
 *
 * @remarks
 * `null` and `undefined` render as an empty string, so optional values can be
 * passed straight through. Arrays are concatenated without a separator.
 */
export type PrintArg = Scalar | null | undefined;

/**
 * Positioning and styling options for {@link CommandQueue.print}.
 *
 * @remarks
 * The anchors {@link PrintOptions.face | face}, `player`, `head`, `foe` and
 * `center` are mutually exclusive and are applied in that order of precedence.
 * Without any of them the coordinates are absolute screen coordinates.
 */
export interface PrintOptions {
  /** Column. Only used together with {@link PrintOptions.y}. */
  x?: number;
  /** Row. Only used together with {@link PrintOptions.x}. */
  y?: number;
  /**
   * StoneScript colour code, e.g. `"r"` for red.
   *
   * @remarks
   * Only applied when both `x` and `y` are given.
   */
  color?: string;
  /**
   * Draw on the player's face instead of on the screen.
   *
   * @remarks
   * Overrides every positioning option, including `x` and `y`.
   */
  face?: boolean;
  /** Treat the coordinates as relative to the player. */
  player?: boolean;
  /** Treat the coordinates as relative to the player's head. */
  head?: boolean;
  /** Treat the coordinates as relative to the current foe. */
  foe?: boolean;
  /** Treat the coordinates as relative to the centre of the screen. */
  center?: boolean;
}

/**
 * The part of {@link SSRPGInterface} a {@link CommandQueue} needs in order to
 * flush itself.
 */
export interface CommandFlusher {
  /**
   * Sends several requests in a single round trip.
   *
   * @param requests - The batch to send.
   * @returns One value per request.
   */
  multiCall(requests: readonly Request[]): Promise<CallValue[]>;
}

/**
 * Collects StoneScript commands during a step and sends them in one batch.
 *
 * @remarks
 * You rarely need to construct this yourself: {@link SSRPGInterface} owns one
 * as {@link SSRPGInterface.command} and mirrors every method on itself, so
 * `ssrpg.brew("tar", "wood")` and `ssrpg.command.brew("tar", "wood")` are
 * equivalent. {@link SSRPGInterface.step} clears the queue before the callback
 * runs and flushes it afterwards.
 *
 * @example
 * ```ts
 * await ssrpg.step(() => {
 *   ssrpg.print("hello", { x: 1, y: 1 });
 *   ssrpg.equipR("sword");
 * }); // both commands leave in one packet here
 * ```
 */
export class CommandQueue {
  readonly #host: CommandFlusher;
  #queue: Request[] = [];

  /**
   * @param host - Used to send the batch when {@link CommandQueue.run} is
   * called.
   */
  constructor(host: CommandFlusher) {
    this.#host = host;
  }

  /** The commands queued so far in this step, in insertion order. */
  get pending(): readonly Request[] {
    return this.#queue;
  }

  /** Discards every queued command without sending it. */
  clear(): void {
    this.#queue = [];
  }

  /**
   * Sends every queued command in one batch and empties the queue.
   *
   * @remarks
   * The queue is emptied before the request is awaited, so a failed flush does
   * not resend the same commands on the next step.
   *
   * @returns A promise that settles once the game has acknowledged the batch.
   * Resolves immediately when nothing is queued.
   */
  async run(): Promise<void> {
    if (this.#queue.length === 0) return;
    const batch = this.#queue;
    this.#queue = [];
    await this.#host.multiCall(batch);
  }

  /**
   * Queues a raw request.
   *
   * @remarks
   * An escape hatch for commands this class does not wrap; prefer the typed
   * methods below.
   *
   * @param name - StoneScript command or function name.
   * @param args - Arguments, already in the shape the game expects.
   */
  push(name: string, ...args: Scalar[]): void {
    this.#queue.push([name, ...args]);
  }

  /**
   * Queues `>` — prints text to the screen.
   *
   * @param text - What to print. An array is concatenated without a separator,
   * which is how you interpolate several values into one line.
   * @param options - Where and how to draw it.
   *
   * @example
   * ```ts
   * ssrpg.print("hp low!", { x: 1, y: 1, color: "r" });
   * ssrpg.print("!", { x: 0, y: -1, foe: true });      // above the foe
   * ssrpg.print(["hp: ", 42]);                          // "hp: 42"
   * ```
   */
  print(text: PrintArg | readonly PrintArg[], options: PrintOptions = {}): void {
    const { x, y, color, face, player, head, foe, center } = options;
    const parts: string[] = [];

    if (face) {
      parts.push("(");
    } else if (Number.isInteger(x) && Number.isInteger(y)) {
      const prefix = player ? "o" : head ? "h" : foe ? "f" : center ? "c" : "`";
      parts.push(`${prefix}${x},${y},`);
      if (color) parts.push(`${color},`);
    }

    parts.push(...toParts(text));
    this.push(">", parts.join(""));
  }

  /**
   * Queues `play` — plays a sound.
   *
   * @param args - Sound name and any modifiers, joined with spaces.
   */
  play(...args: PrintArg[]): void {
    this.push("play", joinArgs(args, " "));
  }

  /**
   * Queues `equipR` — equips items to the right hand.
   *
   * @param items - Item names, joined with spaces. Several names let the game
   * fall back to the next one when an item is unavailable.
   */
  equipR(...items: string[]): void {
    this.push("equipR", items.join(" "));
  }

  /**
   * Queues `equipL` — equips items to the left hand.
   *
   * @param items - Item names, joined with spaces.
   */
  equipL(...items: string[]): void {
    this.push("equipL", items.join(" "));
  }

  /**
   * Queues `equip` — equips items to whichever hand fits best.
   *
   * @param items - Item names, joined with spaces.
   */
  equip(...items: string[]): void {
    this.push("equip", items.join(" "));
  }

  /**
   * Queues `loadout` — switches to a saved loadout.
   *
   * @param index - The loadout slot to switch to.
   */
  loadout(index: number): void {
    this.push("loadout", String(index));
  }

  /**
   * Queues `activate` — activates the item in the given hand.
   *
   * @param args - `"R"` or `"L"`, plus any modifiers, joined with spaces.
   *
   * @see {@link Item.CanActivate} to check first.
   */
  activate(...args: PrintArg[]): void {
    this.push("activate", joinArgs(args, " "));
  }

  /**
   * Queues `enable` — enables items or abilities.
   *
   * @param names - Item or ability names, joined with spaces.
   */
  enable(...names: string[]): void {
    this.push("enable", names.join(" "));
  }

  /**
   * Queues `disable` — disables items or abilities.
   *
   * @param names - Item or ability names, joined with spaces.
   */
  disable(...names: string[]): void {
    this.push("disable", names.join(" "));
  }

  /**
   * Queues `brew` — brews a potion from the given materials.
   *
   * @param materials - Material names, joined with `+` as the game expects.
   *
   * @example
   * ```ts
   * ssrpg.brew("tar", "wood"); // sends "tar+wood"
   * ```
   */
  brew(...materials: string[]): void {
    this.push("brew", materials.join("+"));
  }
}

/**
 * Stringifies a print argument or list of them, dropping nullish values.
 *
 * @param value - A single argument or an array of them.
 * @returns One string per argument.
 */
function toParts(value: PrintArg | readonly PrintArg[]): string[] {
  const items = Array.isArray(value) ? value : [value as PrintArg];
  return items.map((item) => (item === null || item === undefined ? "" : String(item)));
}

/**
 * Stringifies and joins command arguments.
 *
 * @param args - The arguments to join.
 * @param separator - String to place between them.
 * @returns The joined payload.
 */
function joinArgs(args: readonly PrintArg[], separator: string): string {
  return toParts(args).join(separator);
}
