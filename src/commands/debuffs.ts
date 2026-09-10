import { createBuffs, createPlayerBuffs, type Buffs, type PlayerBuffs } from "./buffs";
import type { CallHost } from "./base";

/** `debuffs` shares its shape with `buffs`. */
export type Debuffs = Buffs;
export type PlayerDebuffs = PlayerBuffs;

export function createDebuffs(host: CallHost, className = "debuffs"): Debuffs {
  return createBuffs(host, className);
}

export function createPlayerDebuffs(host: CallHost, className = "debuffs"): PlayerDebuffs {
  return createPlayerBuffs(host, className);
}
