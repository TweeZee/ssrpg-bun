import { namespace, type CallHost } from "./base";

/** `buffs` / `foe.buffs` — a buff or debuff collection. */
export interface Buffs {
  count(): Promise<number | null>;
  string(): Promise<string | null>;
  GetCount(buffName: string): Promise<number | null>;
  GetTime(buffName: string): Promise<number | null>;
}

/** The player's own buffs, which additionally expose `oldest`. */
export interface PlayerBuffs extends Buffs {
  oldest(): Promise<string | null>;
}

export function createBuffs(host: CallHost, className = "buffs"): Buffs {
  const ns = namespace(host, className);
  return {
    count: () => ns.int("count"),
    string: () => ns.str("string"),
    GetCount: (buffName) => ns.int("GetCount", buffName),
    GetTime: (buffName) => ns.int("GetTime", buffName),
  };
}

export function createPlayerBuffs(host: CallHost, className = "buffs"): PlayerBuffs {
  const ns = namespace(host, className);
  return { ...createBuffs(host, className), oldest: () => ns.str("oldest") };
}
