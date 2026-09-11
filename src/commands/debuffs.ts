/**
 * The `debuffs` namespace.
 *
 * @remarks
 * Debuffs expose exactly the same members as buffs, so the types are aliases
 * of {@link Buffs} and {@link PlayerBuffs} and only the bound class differs.
 *
 * @packageDocumentation
 */
import { createBuffs, createPlayerBuffs, type Buffs, type PlayerBuffs } from "./buffs";
import type { CallHost } from "./base";

/** `debuffs` — a debuff collection. Shares its shape with {@link Buffs}. */
export type Debuffs = Buffs;

/** The player's own debuffs. Shares its shape with {@link PlayerBuffs}. */
export type PlayerDebuffs = PlayerBuffs;

/**
 * Builds a {@link Debuffs} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class to bind to. Defaults to `debuffs`.
 * @returns Accessors for that collection.
 */
export function createDebuffs(host: CallHost, className = "debuffs"): Debuffs {
  return createBuffs(host, className);
}

/**
 * Builds a {@link PlayerDebuffs} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class to bind to. Defaults to `debuffs`.
 * @returns Accessors for the player's debuffs.
 */
export function createPlayerDebuffs(host: CallHost, className = "debuffs"): PlayerDebuffs {
  return createPlayerBuffs(host, className);
}
