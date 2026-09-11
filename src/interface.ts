/**
 * The high-level interface to Stone Story RPG.
 *
 * @packageDocumentation
 */
import { MindConnectClient, type ClientOptions } from "./client";
import { ConnectionClosedError, ModeError } from "./errors";
import { PROTOCOL_VERSION } from "./protocol";
import type { CallValue, Mode, Request, Scalar, StepContext } from "./types";
import type {
  ArgsOf,
  CallName,
  MultiCallResults,
  QueueArgsOf,
  QueueName,
  ReadSpec,
  ResultOf,
  ResultOfSpec,
  TypedRequest,
} from "./schema/index";

import { CommandQueue, type PrintArg, type PrintOptions } from "./commands/command";
import type { CallHost } from "./commands/base";
import type { ActivateTarget, ItemCriteria, Loose, SoundId, ToggleFeature, HudOpts } from "./schema/index";
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
    this.command = new CommandQueue({
      multiCall: (requests) => this.multiCallRaw(requests),
    });

    // The namespace wrappers build their own member paths, so they go through
    // the unchecked entry points rather than the typed public ones.
    const host: CallHost = {
      call: (command, ...args) => this.callRaw(command, ...args),
      callUncached: (command, ...args) => this.callUncachedRaw(command, ...args),
      queue: (command, ...args) => this.command.pushRaw(command, ...args),
    };

    this.ai = createAI(host);
    this.armor = createArmor(host);
    this.buffs = createPlayerBuffs(host);
    this.debuffs = createPlayerDebuffs(host);
    this.draw = createDraw(host);
    this.encounter = createEncounter(host);
    this.event = createEvent(host);
    this.foe = createFoe(host);
    this.harvest = createHarvest(host);
    this.input = createInput(host);
    this.item = createItem(host);
    this.loc = createLoc(host);
    this.pickup = createPickup(host);
    this.player = createPlayer(host);
    this.pos = createPosition(host);
    this.res = createResource(host);
    this.screen = createScreen(host);
    this.summon = createSummon(host);
    this.var = createVariable(host);
    this.key = createKey(host);
    this.storage = createStorage(host);
    this.te = createText(host);
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
   * The name is checked against {@link StoneScriptAPI}, so a typo is a compile
   * error, the argument list is the one that member actually takes, and the
   * result is narrowed to that member's own type instead of
   * {@link CallValue}.
   *
   * The result is memoised for the rest of the current step, so repeated reads
   * of the same value cost one round trip. Concurrent reads share the pending
   * promise rather than issuing a second request. A failed call is evicted, so
   * it can be retried.
   *
   * Do not use this for anything with side effects — use
   * {@link SSRPGInterface.callUncached} instead, or the cache will swallow the
   * second call.
   *
   * @typeParam N - The member name, inferred from the argument.
   * @param name - A member of the StoneScript API, e.g. `foe.name`.
   * @param args - The arguments that member takes.
   * @returns The value, narrowed to that member's return type.
   *
   * @example
   * ```ts
   * const name = await ssrpg.call("foe.name");            // string | null
   * const near = await ssrpg.call("foe.GetCount", 8);     // number | null
   * const begin = await ssrpg.call("loc.begin");          // boolean
   * await ssrpg.call("foe.nope");                         // compile error
   * await ssrpg.call("foe.GetCount");                     // compile error
   * ```
   */
  call<N extends CallName>(name: N, ...args: ArgsOf<N>): Promise<ResultOf<N>> {
    return this.callRaw(name, ...(args as Scalar[])) as Promise<ResultOf<N>>;
  }

  /**
   * Reads a variable or calls a function, bypassing the cache entirely.
   *
   * @remarks
   * The right choice for calls with side effects and for values the in-game
   * script can change mid-step. Typed exactly like {@link SSRPGInterface.call}.
   *
   * @typeParam N - The member name, inferred from the argument.
   * @param name - A member of the StoneScript API, e.g. `var.get`.
   * @param args - The arguments that member takes.
   * @returns The value, narrowed to that member's return type.
   */
  callUncached<N extends CallName>(name: N, ...args: ArgsOf<N>): Promise<ResultOf<N>> {
    return this.callUncachedRaw(name, ...(args as Scalar[])) as Promise<ResultOf<N>>;
  }

  /**
   * Sends several requests in a single round trip, narrowing each result.
   *
   * @remarks
   * Never cached, in either direction. This is the cheapest way to read a lot
   * of state at once, since one packet replaces one round trip per value.
   *
   * The returned tuple lines up with the requests position by position, each
   * carrying the type of the member that produced it — so destructuring gives
   * you real types rather than {@link CallValue}.
   *
   * @typeParam R - The request tuple, inferred as literal types.
   * @param requests - The batch to send.
   * @returns One narrowed value per request, in order.
   *
   * @example
   * ```ts
   * const [name, hp, begin] = await ssrpg.multiCall([
   *   ["foe.name"],
   *   ["foe.hp"],
   *   ["loc.begin"],
   * ]);
   * // name: string | null, hp: number | null, begin: boolean
   * ```
   */
  multiCall<const R extends readonly TypedRequest[]>(
    requests: R,
  ): Promise<MultiCallResults<R>> {
    return this.multiCallRaw(requests as readonly Request[]) as Promise<MultiCallResults<R>>;
  }

  /**
   * Reads several members in one round trip and returns them by name.
   *
   * @remarks
   * The result object has exactly the keys you passed, each narrowed to the
   * type of the member behind it. A value is either a bare member name or a
   * request tuple when it needs arguments. Not cached.
   *
   * @typeParam M - The map of result names to members, inferred as literals.
   * @param members - What to read, keyed by the name you want it under.
   * @returns One property per key, narrowed to that member's return type.
   *
   * @example
   * ```ts
   * const state = await ssrpg.readAll({
   *   hp: "hp",
   *   foe: "foe.name",
   *   nearby: ["foe.GetCount", 8],
   *   starting: "loc.begin",
   * });
   * // state.hp: number | null
   * // state.foe: string | null
   * // state.nearby: number | null
   * // state.starting: boolean
   * ```
   */
  async readAll<const M extends Readonly<Record<string, ReadSpec>>>(
    members: M,
  ): Promise<{ [K in keyof M]: ResultOfSpec<M[K]> }> {
    const keys = Object.keys(members) as (keyof M & string)[];
    const requests = keys.map((key) => {
      const spec = members[key] as ReadSpec;
      return (typeof spec === "string" ? [spec] : spec) as Request;
    });

    const values = await this.multiCallRaw(requests);
    const result = {} as { [K in keyof M]: ResultOfSpec<M[K]> };
    keys.forEach((key, index) => {
      result[key] = values[index] as never;
    });
    return result;
  }

  /**
   * Reads a variable or calls a function without checking the name.
   *
   * @remarks
   * The escape hatch for a member this library does not know yet — a new game
   * version, or a name the schema is missing. Cached like
   * {@link SSRPGInterface.call}, but the result is the untyped
   * {@link CallValue}.
   *
   * @param command - Fully qualified StoneScript name.
   * @param args - Arguments to pass to the function.
   * @returns The value, converted by {@link autoCast}.
   */
  callRaw(command: string, ...args: Scalar[]): Promise<CallValue> {
    const key = JSON.stringify([command, ...args]);
    const cached = this.#cache.get(key);
    if (cached) return cached;

    const pending = this.callUncachedRaw(command, ...args);
    this.#cache.set(key, pending);
    pending.catch(() => this.#cache.delete(key));
    return pending;
  }

  /**
   * Reads a variable or calls a function without checking the name or caching
   * the result.
   *
   * @param command - Fully qualified StoneScript name.
   * @param args - Arguments to pass to the function.
   * @returns The value, converted by {@link autoCast}.
   */
  async callUncachedRaw(command: string, ...args: Scalar[]): Promise<CallValue> {
    const values = await this.#client.sendAndReceive([[command, ...args]]);
    return values.length > 0 ? values[0]! : null;
  }

  /**
   * Sends several requests in a single round trip without checking the names.
   *
   * @param requests - The batch to send.
   * @returns One untyped value per request, in order.
   */
  async multiCallRaw(requests: readonly Request[]): Promise<CallValue[]> {
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
   * @typeParam N - The member or command name, inferred from the argument.
   * @param name - A queueable StoneScript name, e.g. `loc.Pause`.
   * @param args - The arguments that name takes.
   */
  queue<N extends QueueName>(name: N, ...args: QueueArgsOf<N>): void {
    this.command.push(name, ...args);
  }

  /**
   * Queues a request without checking the name.
   *
   * @param command - Fully qualified StoneScript name.
   * @param args - Arguments to pass along.
   */
  queueRaw(command: string, ...args: Scalar[]): void {
    this.command.pushRaw(command, ...args);
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

    const symbols = (await this.multiCallRaw(requests)).map((value) =>
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
   * Queues `play` — plays a sound effect.
   *
   * @param sound - Sound id; the documented ids autocomplete.
   * @param pitch - Playback pitch, `100` being unchanged.
   *
   * @see {@link CommandQueue.play}
   */
  play(sound: Loose<SoundId>, pitch?: number): void {
    this.command.play(sound, pitch);
  }

  /**
   * Queues `equipR` — equips an item to the right hand.
   *
   * @param criteria - Search criteria: name fragments, filter tags, `*n` star
   * levels, `+n` enchantment bonuses, or `-` negations.
   *
   * @see {@link CommandQueue.equipR}
   */
  equipR(...criteria: ItemCriteria[]): void {
    this.command.equipR(...criteria);
  }

  /**
   * Queues `equipL` — equips an item to the left hand.
   *
   * @param criteria - Search criteria: name fragments, filter tags, `*n` star
   * levels, `+n` enchantment bonuses, or `-` negations.
   *
   * @see {@link CommandQueue.equipL}
   */
  equipL(...criteria: ItemCriteria[]): void {
    this.command.equipL(...criteria);
  }

  /**
   * Queues `equip` — equips an item to whichever hand fits best.
   *
   * @param criteria - Search criteria: name fragments, filter tags, `*n` star
   * levels, `+n` enchantment bonuses, or `-` negations.
   *
   * @see {@link CommandQueue.equip}
   */
  equip(...criteria: ItemCriteria[]): void {
    this.command.equip(...criteria);
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
   * Queues `activate` — activates an item ability.
   *
   * @param target - A hand, the potion, or an ability id.
   *
   * @see {@link CommandQueue.activate}, {@link Item.CanActivate}
   */
  activate(target: ActivateTarget): void {
    this.command.activate(target);
  }

  /**
   * Queues `enable` — restores a game feature.
   *
   * @param feature - The feature to restore, or `hud` plus element flags.
   *
   * @see {@link CommandQueue.enable}
   */
  enable(feature: ToggleFeature): void;
  enable<F extends string>(hud: `hud ${HudOpts<F>}`): void;
  enable(feature: ToggleFeature): void {
    this.command.enable(feature);
  }

  /**
   * Queues `disable` — turns a game feature off.
   *
   * @param feature - The feature to disable, or `hud` plus element flags.
   *
   * @see {@link CommandQueue.disable}
   */
  disable(feature: ToggleFeature): void;
  disable<F extends string>(hud: `hud ${HudOpts<F>}`): void;
  disable(feature: ToggleFeature): void {
    this.command.disable(feature);
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
  async #int(name: CallName): Promise<number | null> {
    const value = await this.callRaw(name);
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
