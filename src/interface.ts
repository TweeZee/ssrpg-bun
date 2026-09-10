/**
 * SSRPGInterface — high-level interface to Stone Story RPG.
 *
 * A Bun/TypeScript port of the Python `ssrpgif` library
 * (MindConnect protocol v0.3).
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

export interface SSRPGInterfaceOptions extends ClientOptions {
  /**
   * Must match the `//MindConnect: [mode]` header of the in-game script.
   * Defaults to `sync`.
   */
  mode?: Mode;
  /** Log a warning when the game reports a different protocol version. */
  warnOnVersionMismatch?: boolean;
}

/** A step callback. Receives `pre`/`post` in sync mode, `exclusive` otherwise. */
export type StepFunction = (context: StepContext) => void | Promise<void>;

export interface RunOptions {
  /** Aborting disconnects and lets {@link SSRPGInterface.run} return. */
  signal?: AbortSignal;
}

const MODES: readonly Mode[] = ["sync", "async", "exclusive"];

export class SSRPGInterface {
  static readonly PROTOCOL_VERSION = PROTOCOL_VERSION;

  readonly #client: MindConnectClient;
  readonly #mode: Mode;
  readonly #warnOnVersionMismatch: boolean;
  #versionWarned = false;

  /** Per-step memo of every cached call. Cleared at the start of each step. */
  readonly #cache = new Map<string, Promise<CallValue>>();

  /** Commands queued during the current step. */
  readonly command: CommandQueue;

  // --- StoneScript namespaces -------------------------------------------
  readonly ai: AI;
  readonly armor: Armor;
  readonly buffs: PlayerBuffs;
  readonly debuffs: PlayerDebuffs;
  readonly draw: Draw;
  readonly encounter: Encounter;
  readonly event: Event;
  readonly foe: Foe;
  readonly harvest: Harvest;
  readonly input: Input;
  readonly item: Item;
  readonly loc: Loc;
  readonly pickup: Pickup;
  readonly player: Player;
  readonly pos: Position;
  readonly res: Resource;
  readonly screen: Screen;
  readonly summon: Summon;
  readonly var: Variable;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly key: Key;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly storage: Storage;
  /** @experimental Not enabled in the Python reference implementation. */
  readonly te: Text;

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

  get mode(): Mode {
    return this.#mode;
  }

  get connected(): boolean {
    return this.#client.connected;
  }

  /** The low-level client, for protocol-level access. */
  get client(): MindConnectClient {
    return this.#client;
  }

  // --- connection --------------------------------------------------------

  /** Opens the connection to the game. */
  async connect(): Promise<void> {
    await this.#client.connect();
  }

  /** Closes the connection. Safe to call more than once. */
  disconnect(): void {
    this.#client.close();
  }

  /** Forgets every cached call. Called automatically at the start of a step. */
  clearCache(): void {
    this.#cache.clear();
  }

  // --- stepping ----------------------------------------------------------

  /**
   * Waits for the next step signal, runs `stepFunction`, flushes the queued
   * commands and hands control back to the game.
   *
   * @returns the context the callback ran in.
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
   * Steps in a loop until the connection closes or `options.signal` aborts.
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
   * Reads a variable or calls a function. The result is memoised for the rest
   * of the current step, so repeated reads cost a single round trip.
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

  /** Like {@link SSRPGInterface.call} but bypasses (and ignores) the cache. */
  async callUncached(command: string, ...args: Scalar[]): Promise<CallValue> {
    const values = await this.#client.sendAndReceive([[command, ...args]]);
    return values.length > 0 ? values[0]! : null;
  }

  /** Sends several requests in a single round trip. */
  async multiCall(requests: readonly Request[]): Promise<CallValue[]> {
    return this.#client.sendAndReceive(requests);
  }

  /**
   * Fire-and-forget request for `async` mode. The callback receives the
   * response values, or an error if the request failed.
   *
   * @returns the request id assigned to the batch.
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

  /** Queues a request to be sent when the current step ends. */
  queue(command: string, ...args: Scalar[]): void {
    this.command.push(command, ...args);
  }

  /**
   * Reads a `w` x `h` block of the screen, starting at (`x`, `y`), as text.
   * Missing cells become spaces.
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

  /** `time` — frames elapsed in the current location. */
  time(): Promise<number | null> {
    return this.#int("time");
  }

  /** `totaltime` — frames elapsed since the run started. */
  totaltime(): Promise<number | null> {
    return this.#int("totaltime");
  }

  /** `hp` — the player's current health. */
  hp(): Promise<number | null> {
    return this.#int("hp");
  }

  /** `maxhp` — the player's maximum health. */
  maxhp(): Promise<number | null> {
    return this.#int("maxhp");
  }

  /** `maxarmor` — the player's maximum armour. */
  maxarmor(): Promise<number | null> {
    return this.#int("maxarmor");
  }

  /** `face` — the player's current face. */
  async face(): Promise<string | null> {
    const value = await this.call("face");
    return value === null ? null : String(value);
  }

  /** `bighead` — whether big-head mode is on. */
  async bighead(): Promise<boolean> {
    return (await this.call("bighead")) === true;
  }

  /** `totalgp` — total gold pieces collected. */
  totalgp(): Promise<number | null> {
    return this.#int("totalgp");
  }

  // --- queued command shorthands -----------------------------------------

  /** Queues `>` — prints text to the screen. */
  print(text: PrintArg | readonly PrintArg[], options?: PrintOptions): void {
    this.command.print(text, options);
  }

  /** Queues `play` — plays a sound. */
  play(...args: PrintArg[]): void {
    this.command.play(...args);
  }

  /** Queues `equipR` — equips items to the right hand. */
  equipR(...items: string[]): void {
    this.command.equipR(...items);
  }

  /** Queues `equipL` — equips items to the left hand. */
  equipL(...items: string[]): void {
    this.command.equipL(...items);
  }

  /** Queues `equip` — equips items to whichever hand fits best. */
  equip(...items: string[]): void {
    this.command.equip(...items);
  }

  /** Queues `loadout` — switches to a saved loadout. */
  loadout(index: number): void {
    this.command.loadout(index);
  }

  /** Queues `activate` — activates the item in the given hand. */
  activate(...args: PrintArg[]): void {
    this.command.activate(...args);
  }

  /** Queues `enable` — enables items or abilities. */
  enable(...names: string[]): void {
    this.command.enable(...names);
  }

  /** Queues `disable` — disables items or abilities. */
  disable(...names: string[]): void {
    this.command.disable(...names);
  }

  /** Queues `brew` — brews a potion from the given materials. */
  brew(...materials: string[]): void {
    this.command.brew(...materials);
  }

  // --- internals ---------------------------------------------------------

  async #int(name: string): Promise<number | null> {
    const value = await this.call(name);
    return typeof value === "number" ? value : null;
  }

  #checkVersion(version: string): void {
    if (!this.#warnOnVersionMismatch || this.#versionWarned) return;
    if (version === PROTOCOL_VERSION) return;
    this.#versionWarned = true;
    console.warn(
      `[ssrpg] Protocol version mismatch: client speaks v${PROTOCOL_VERSION}, game reports v${version}.`,
    );
  }
}
