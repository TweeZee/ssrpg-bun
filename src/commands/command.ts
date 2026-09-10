/**
 * The command queue. Commands are collected during a step and flushed to the
 * game in a single request batch when the step callback returns.
 */
import type { CallValue, Request, Scalar } from "../types";

/** Anything that can be printed; arrays are concatenated without a separator. */
export type PrintArg = Scalar | null | undefined;

export interface PrintOptions {
  /** Column. Only used together with {@link PrintOptions.y}. */
  x?: number;
  /** Row. Only used together with {@link PrintOptions.x}. */
  y?: number;
  /** Colour code, e.g. `"r"`. Only applied when `x` and `y` are given. */
  color?: string;
  /** Draw on the player's face. Overrides every positioning option. */
  face?: boolean;
  /** Position relative to the player. */
  player?: boolean;
  /** Position relative to the player's head. */
  head?: boolean;
  /** Position relative to the current foe. */
  foe?: boolean;
  /** Position relative to the screen centre. */
  center?: boolean;
}

export interface CommandFlusher {
  multiCall(requests: readonly Request[]): Promise<CallValue[]>;
}

export class CommandQueue {
  readonly #host: CommandFlusher;
  #queue: Request[] = [];

  constructor(host: CommandFlusher) {
    this.#host = host;
  }

  /** The commands queued so far in this step. */
  get pending(): readonly Request[] {
    return this.#queue;
  }

  clear(): void {
    this.#queue = [];
  }

  /** Sends every queued command in one batch and empties the queue. */
  async run(): Promise<void> {
    if (this.#queue.length === 0) return;
    const batch = this.#queue;
    this.#queue = [];
    await this.#host.multiCall(batch);
  }

  /** Queues a raw request. Prefer the typed helpers below. */
  push(name: string, ...args: Scalar[]): void {
    this.#queue.push([name, ...args]);
  }

  /** `>` — prints text to the screen. */
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

  /** `play` — plays a sound. */
  play(...args: PrintArg[]): void {
    this.push("play", joinArgs(args, " "));
  }

  /** `equipR` — equips items to the right hand. */
  equipR(...items: string[]): void {
    this.push("equipR", items.join(" "));
  }

  /** `equipL` — equips items to the left hand. */
  equipL(...items: string[]): void {
    this.push("equipL", items.join(" "));
  }

  /** `equip` — equips items to whichever hand fits best. */
  equip(...items: string[]): void {
    this.push("equip", items.join(" "));
  }

  /** `loadout` — switches to a saved loadout. */
  loadout(index: number): void {
    this.push("loadout", String(index));
  }

  /** `activate` — activates the item in the given hand (`"R"` or `"L"`). */
  activate(...args: PrintArg[]): void {
    this.push("activate", joinArgs(args, " "));
  }

  /** `enable` — enables items or abilities. */
  enable(...names: string[]): void {
    this.push("enable", names.join(" "));
  }

  /** `disable` — disables items or abilities. */
  disable(...names: string[]): void {
    this.push("disable", names.join(" "));
  }

  /** `brew` — brews a potion from the given materials. */
  brew(...materials: string[]): void {
    this.push("brew", materials.join("+"));
  }
}

function toParts(value: PrintArg | readonly PrintArg[]): string[] {
  const items = Array.isArray(value) ? value : [value as PrintArg];
  return items.map((item) => (item === null || item === undefined ? "" : String(item)));
}

function joinArgs(args: readonly PrintArg[], separator: string): string {
  return toParts(args).join(separator);
}
