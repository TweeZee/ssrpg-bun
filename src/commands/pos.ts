/**
 * The `pos` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `pos` — the player's position in world coordinates.
 *
 * @see {@link Screen.FromWorldX} to convert these to screen coordinates.
 */
export interface Position {
  /**
   * Reads `pos.x`.
   *
   * @returns Horizontal world position.
   */
  x(): Promise<number | null>;

  /**
   * Reads `pos.y`.
   *
   * @returns Vertical world position.
   */
  y(): Promise<number | null>;

  /**
   * Reads `pos.z`.
   *
   * @returns Depth lane the player stands in.
   */
  z(): Promise<number | null>;
}

/**
 * Builds the {@link Position} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `pos`.
 */
export function createPosition(host: CallHost): Position {
  const ns = namespace(host, "pos");
  return {
    x: () => ns.int("x"),
    y: () => ns.int("y"),
    z: () => ns.int("z"),
  };
}
