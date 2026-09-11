/**
 * The `buffs` namespace, shared by the player and by foes.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * A buff or debuff collection, such as `buffs` or `foe.buffs`.
 */
export interface Buffs {
  /**
   * Reads `count`.
   *
   * @returns How many buffs are currently active.
   */
  count(): Promise<number | null>;

  /**
   * Reads `string`.
   *
   * @returns The collection rendered the way the game displays it.
   */
  string(): Promise<string | null>;

  /**
   * Calls `GetCount`.
   *
   * @param buffName - Buff id, e.g. `"burn"`.
   * @returns How many stacks of that buff are active; `0` when it is absent.
   */
  GetCount(buffName: string): Promise<number | null>;

  /**
   * Calls `GetTime`.
   *
   * @param buffName - Buff id, e.g. `"burn"`.
   * @returns Remaining duration of the buff, in frames.
   */
  GetTime(buffName: string): Promise<number | null>;
}

/**
 * The player's own buffs, which additionally expose `oldest`.
 */
export interface PlayerBuffs extends Buffs {
  /**
   * Reads `oldest`.
   *
   * @returns Id of the buff that has been active longest.
   */
  oldest(): Promise<string | null>;
}

/**
 * Builds a {@link Buffs} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class to bind to. Defaults to `buffs`; pass
 * `"foe.buffs"` or `"foe.debuffs"` for a foe's collections.
 * @returns Accessors for that collection.
 */
export function createBuffs(host: CallHost, className = "buffs"): Buffs {
  const ns = namespace(host, className);
  return {
    count: () => ns.int("count"),
    string: () => ns.str("string"),
    GetCount: (buffName) => ns.int("GetCount", buffName),
    GetTime: (buffName) => ns.int("GetTime", buffName),
  };
}

/**
 * Builds a {@link PlayerBuffs} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class to bind to. Defaults to `buffs`.
 * @returns Accessors for the player's buffs.
 */
export function createPlayerBuffs(host: CallHost, className = "buffs"): PlayerBuffs {
  const ns = namespace(host, className);
  return { ...createBuffs(host, className), oldest: () => ns.str("oldest") };
}
