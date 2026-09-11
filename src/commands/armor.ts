/**
 * The `armor` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";

/**
 * `armor` — the player's armour.
 *
 * @remarks
 * Call the namespace itself to read the current value, mirroring StoneScript,
 * where `armor` is both a variable and a class.
 *
 * @example
 * ```ts
 * const points = await ssrpg.armor();
 * const percent = await ssrpg.armor.f();
 * ```
 */
export interface Armor {
  /**
   * Reads `armor`.
   *
   * @returns Current armour points, or `null` when the player has no armour.
   */
  (): Promise<number | null>;

  /**
   * Reads `armor.f`.
   *
   * @returns Armour as a fraction of the maximum, in percent.
   */
  f(): Promise<number | null>;
}

/**
 * Builds the {@link Armor} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `armor`.
 */
export function createArmor(host: CallHost): Armor {
  const ns = namespace(host, "armor");
  return callable(() => ns.int(""), {
    f: () => ns.int("f"),
  }) satisfies Armor;
}
