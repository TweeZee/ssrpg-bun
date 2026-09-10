import { createBuffs, type Buffs } from "./buffs";
import { callable, namespace, type CallHost } from "./base";

/** `foe` — the foe the player is currently targeting. Call it to read its name. */
export interface Foe {
  (): Promise<string | null>;
  id(): Promise<string | null>;
  name(): Promise<string | null>;
  damage(): Promise<number | null>;
  distance(): Promise<number | null>;
  z(): Promise<number | null>;
  count(): Promise<number | null>;
  /** Number of foes within `distance`. */
  GetCount(distance: number): Promise<number | null>;
  hp(): Promise<number | null>;
  maxhp(): Promise<number | null>;
  armor(): Promise<number | null>;
  maxarmor(): Promise<number | null>;
  state(): Promise<number | null>;
  time(): Promise<number | null>;
  level(): Promise<number | null>;
  readonly buffs: Buffs;
  readonly debuffs: Buffs;
}

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
