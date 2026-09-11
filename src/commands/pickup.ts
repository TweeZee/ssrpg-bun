/**
 * The `pickup` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";

/**
 * `pickup` — the nearest item lying on the ground.
 *
 * @remarks
 * Call the namespace itself to read the item's name, mirroring StoneScript,
 * where `pickup` is both a variable and a class.
 */
export interface Pickup {
  /**
   * Reads `pickup`.
   *
   * @returns Name of the nearest item on the ground, or `null` when there is
   * none.
   */
  (): Promise<string | null>;

  /**
   * Reads `pickup.distance`.
   *
   * @returns Distance from the player, in tiles.
   */
  distance(): Promise<number | null>;

  /**
   * Reads `pickup.z`.
   *
   * @returns Depth lane the item lies in.
   */
  z(): Promise<number | null>;
}

/**
 * Builds the {@link Pickup} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `pickup`.
 */
export function createPickup(host: CallHost): Pickup {
  const ns = namespace(host, "pickup");
  return callable(() => ns.str(""), {
    distance: () => ns.int("distance"),
    z: () => ns.int("z"),
  }) satisfies Pickup;
}
