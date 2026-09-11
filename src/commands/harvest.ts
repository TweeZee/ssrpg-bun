/**
 * The `harvest` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";

/**
 * `harvest` — the nearest harvestable node.
 *
 * @remarks
 * Call the namespace itself to read the node's name, mirroring StoneScript,
 * where `harvest` is both a variable and a class.
 */
export interface Harvest {
  /**
   * Reads `harvest`.
   *
   * @returns Name of the nearest harvestable node, or `null` when there is
   * none.
   */
  (): Promise<string | null>;

  /**
   * Reads `harvest.distance`.
   *
   * @returns Distance from the player, in tiles.
   */
  distance(): Promise<number | null>;

  /**
   * Reads `harvest.z`.
   *
   * @returns Depth lane the node sits in.
   */
  z(): Promise<number | null>;
}

/**
 * Builds the {@link Harvest} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `harvest`.
 */
export function createHarvest(host: CallHost): Harvest {
  const ns = namespace(host, "harvest");
  return callable(() => ns.str(""), {
    distance: () => ns.int("distance"),
    z: () => ns.int("z"),
  }) satisfies Harvest;
}
