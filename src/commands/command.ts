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
import type {
  ActivateTarget,
  Color,
  CommandName,
  HudOpts,
  ItemCriteria,
  Loose,
  QueueArgsOf,
  QueueName,
  SoundId,
  ToggleFeature,
} from "../schema/index";

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
   * Colour of the text: `#rrggbb`, or a preset such as `#red`.
   *
   * @remarks
   * Only applied when both `x` and `y` are given.
   */
  color?: Color;
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
   * Queues a request by name, checked against the StoneScript API.
   *
   * @remarks
   * Accepts both the ten queued commands and any callable member, since the
   * queue is just a deferred batch. The typed methods below are usually more
   * convenient, because they build the joined payload for you.
   *
   * @typeParam N - The member or command name.
   * @param name - StoneScript command or function name.
   * @param args - Arguments for that name.
   *
   * @example
   * ```ts
   * ssrpg.command.push("loc.Pause");
   * ssrpg.command.push("player.ShowScaredFace", 30);
   * ```
   */
  push<N extends QueueName>(name: N, ...args: QueueArgsOf<N>): void {
    this.pushRaw(name, ...(args as Scalar[]));
  }

  /**
   * Queues a request without checking the name.
   *
   * @remarks
   * The escape hatch for a command this library does not know yet.
   *
   * @param name - StoneScript command or function name.
   * @param args - Arguments, already in the shape the game expects.
   */
  pushRaw(name: string, ...args: Scalar[]): void {
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
    this.#command(">", parts.join(""));
  }

  /**
   * Queues `play` — plays a sound effect.
   *
   * @param sound - Sound id. The documented ids autocomplete; others are
   * still accepted.
   * @param pitch - Playback pitch. `100` is unchanged, higher is faster.
   *
   * @see Appendix B of the Stonescript manual for the full list.
   *
   * @example
   * ```ts
   * ssrpg.play("bat_wing");
   * ssrpg.play("ant_attack", 120);
   * ```
   */
  play(sound: Loose<SoundId>, pitch?: number): void {
    this.#command("play", pitch === undefined ? sound : `${sound} ${pitch}`);
  }

  /**
   * Queues `equipR` — equips an item to the right hand.
   *
   * @param criteria - Search criteria, joined with spaces: name fragments,
   * {@link SearchFilter} tags, `*n` star levels, `+n` enchantment bonuses, or
   * any of those negated with `-`. Up to 7.
   */
  equipR(...criteria: ItemCriteria[]): void {
    this.#command("equipR", criteria.join(" "));
  }

  /**
   * Queues `equipL` — equips an item to the left hand.
   *
   * @param criteria - Search criteria, joined with spaces: name fragments,
   * {@link SearchFilter} tags, `*n` star levels, `+n` enchantment bonuses, or
   * any of those negated with `-`. Up to 7.
   */
  equipL(...criteria: ItemCriteria[]): void {
    this.#command("equipL", criteria.join(" "));
  }

  /**
   * Queues `equip` — equips an item to whichever hand fits best.
   *
   * @remarks
   * Two-handed items must be equipped with this form rather than with
   * {@link CommandQueue.equipL} or {@link CommandQueue.equipR}.
   *
   * @param criteria - Search criteria, joined with spaces: name fragments,
   * {@link SearchFilter} tags, `*n` star levels, `+n` enchantment bonuses, or
   * any of those negated with `-`. Up to 7.
   *
   * @example
   * ```ts
   * ssrpg.equip("hammer", "*7", "-socket");
   * ```
   */
  equip(...criteria: ItemCriteria[]): void {
    this.#command("equip", criteria.join(" "));
  }

  /**
   * Queues `loadout` — switches to a saved loadout.
   *
   * @param index - The loadout slot to switch to.
   */
  loadout(index: number): void {
    this.#command("loadout", String(index));
  }

  /**
   * Queues `activate` — activates an item ability.
   *
   * @param target - A hand (`"R"`/`"right"`, `"L"`/`"left"`), the potion
   * (`"P"`/`"potion"`), or an {@link AbilityId}.
   *
   * @see {@link Item.CanActivate} to check first.
   *
   * @example
   * ```ts
   * if (await ssrpg.item.CanActivate("skeleton_arm")) ssrpg.activate("R");
   * ```
   */
  activate(target: ActivateTarget): void {
    this.#command("activate", target);
  }

  /**
   * Queues `enable` — restores a game feature.
   *
   * @param feature - The feature to restore, or `hud` followed by the flags
   * of the elements to bring back.
   *
   * @see {@link CommandQueue.disable}
   */
  enable(feature: ToggleFeature): void;
  enable<F extends string>(hud: `hud ${HudOpts<F>}`): void;
  enable(feature: string): void {
    this.#command("enable", feature);
  }

  /**
   * Queues `disable` — turns a game feature off.
   *
   * @remarks
   * `hud` on its own hides every element; adding flags hides only those —
   * `p` player health, `f` foe health, `a` ability buttons, `r` resources,
   * `b` banner, `u` utility belt. Invalid flag letters are a compile error.
   *
   * @param feature - The feature to disable, or `hud` followed by flags.
   *
   * @example
   * ```ts
   * ssrpg.disable("abilities");
   * ssrpg.disable("hud ru");   // resources and utility belt only
   * ```
   */
  disable(feature: ToggleFeature): void;
  disable<F extends string>(hud: `hud ${HudOpts<F>}`): void;
  disable(feature: string): void {
    this.#command("disable", feature);
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
    this.#command("brew", materials.join("+"));
  }

  /**
   * Queues one of the ten commands with its single joined payload.
   *
   * @param name - The command name.
   * @param payload - The payload the game parses.
   */
  #command(name: CommandName, payload: string): void {
    this.pushRaw(name, payload);
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
