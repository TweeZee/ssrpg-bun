/**
 * The `res` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `res` — the player's carried resources.
 *
 * @see {@link CommandQueue.brew} for spending them.
 */
export interface Resource {
  /**
   * Reads `res.stone`.
   *
   * @returns Stone carried.
   */
  stone(): Promise<number | null>;

  /**
   * Reads `res.wood`.
   *
   * @returns Wood carried.
   */
  wood(): Promise<number | null>;

  /**
   * Reads `res.tar`.
   *
   * @returns Tar carried.
   */
  tar(): Promise<number | null>;

  /**
   * Reads `res.ki`.
   *
   * @returns Ki carried.
   */
  ki(): Promise<number | null>;

  /**
   * Reads `res.bronze`.
   *
   * @returns Bronze carried.
   */
  bronze(): Promise<number | null>;

  /**
   * Reads `res.crystals`.
   *
   * @returns Crystals carried.
   */
  crystals(): Promise<number | null>;
}

/**
 * Builds the {@link Resource} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `res`.
 */
export function createResource(host: CallHost): Resource {
  const ns = namespace(host, "res");
  return {
    stone: () => ns.int("stone"),
    wood: () => ns.int("wood"),
    tar: () => ns.int("tar"),
    ki: () => ns.int("ki"),
    bronze: () => ns.int("bronze"),
    crystals: () => ns.int("crystals"),
  };
}
