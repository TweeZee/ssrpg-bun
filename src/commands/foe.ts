/**
 * The `foe` namespace.
 *
 * @packageDocumentation
 */
import { createBuffs, type Buffs } from "./buffs";
import { callable, namespace, type CallHost } from "./base";

/**
 * `foe` — the foe the player is currently targeting.
 *
 * @remarks
 * Call the namespace itself to read the foe's name, mirroring StoneScript,
 * where `foe` is both a variable and a class. Every member resolves to `null`
 * when no foe is targeted, so guard on the value rather than assuming a foe
 * is present.
 *
 * @example
 * ```ts
 * const name = await ssrpg.foe();
 * const distance = await ssrpg.foe.distance();
 * if (distance !== null && distance < 8) ssrpg.activate("R");
 * ```
 */
export interface Foe {
  /**
   * Reads `foe`.
   *
   * @returns The foe's display name, or `null` when nothing is targeted.
   */
  (): Promise<string | null>;

  /**
   * Reads `foe.id`.
   *
   * @returns The foe's internal id, which is stable across languages.
   */
  id(): Promise<string | null>;

  /**
   * Reads `foe.name`.
   *
   * @returns The foe's display name.
   */
  name(): Promise<string | null>;

  /**
   * Reads `foe.damage`.
   *
   * @returns Damage the foe deals per hit.
   */
  damage(): Promise<number | null>;

  /**
   * Reads `foe.distance`.
   *
   * @returns Distance from the player, in tiles.
   */
  distance(): Promise<number | null>;

  /**
   * Reads `foe.z`.
   *
   * @returns Depth lane the foe stands in.
   */
  z(): Promise<number | null>;

  /**
   * Reads `foe.count`.
   *
   * @returns How many foes are on screen.
   */
  count(): Promise<number | null>;

  /**
   * Calls `foe.GetCount`.
   *
   * @param distance - Maximum distance from the player, in tiles.
   * @returns How many foes are within `distance`.
   */
  GetCount(distance: number): Promise<number | null>;

  /**
   * Reads `foe.hp`.
   *
   * @returns The foe's current health.
   */
  hp(): Promise<number | null>;

  /**
   * Reads `foe.maxhp`.
   *
   * @returns The foe's maximum health.
   */
  maxhp(): Promise<number | null>;

  /**
   * Reads `foe.armor`.
   *
   * @returns The foe's current armour.
   */
  armor(): Promise<number | null>;

  /**
   * Reads `foe.maxarmor`.
   *
   * @returns The foe's maximum armour.
   */
  maxarmor(): Promise<number | null>;

  /**
   * Reads `foe.state`.
   *
   * @returns The foe's state code; see the StoneScript documentation for what
   * each value means.
   */
  state(): Promise<number | null>;

  /**
   * Reads `foe.time`.
   *
   * @returns How long the foe has been in its current state, in frames.
   */
  time(): Promise<number | null>;

  /**
   * Reads `foe.level`.
   *
   * @returns The foe's level.
   */
  level(): Promise<number | null>;

  /** `foe.buffs` — buffs currently on the foe. */
  readonly buffs: Buffs;

  /** `foe.debuffs` — debuffs currently on the foe. */
  readonly debuffs: Buffs;
}

/**
 * Builds the {@link Foe} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `foe`.
 */
export function createFoe(host: CallHost): Foe {
  const ns = namespace(host, "foe");
  return callable(() => ns.str(""), {
    id: () => ns.str("id"),
    name: () => ns.str("name"),
    damage: () => ns.int("damage"),
    distance: () => ns.int("distance"),
    z: () => ns.int("z"),
    count: () => ns.int("count"),
    GetCount: (distance: number) => ns.int("GetCount", distance),
    hp: () => ns.int("hp"),
    maxhp: () => ns.int("maxhp"),
    armor: () => ns.int("armor"),
    maxarmor: () => ns.int("maxarmor"),
    state: () => ns.int("state"),
    time: () => ns.int("time"),
    level: () => ns.int("level"),
    buffs: createBuffs(host, "foe.buffs"),
    debuffs: createBuffs(host, "foe.debuffs"),
  }) satisfies Foe;
}
