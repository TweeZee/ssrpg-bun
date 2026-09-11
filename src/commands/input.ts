/**
 * The `input` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `input` — the player's pointer position, in screen cells.
 */
export interface Input {
  /**
   * Reads `input.x`.
   *
   * @returns Pointer column, or `null` when there is no pointer on screen.
   */
  x(): Promise<number | null>;

  /**
   * Reads `input.y`.
   *
   * @returns Pointer row, or `null` when there is no pointer on screen.
   */
  y(): Promise<number | null>;
}

/**
 * Builds the {@link Input} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `input`.
 */
export function createInput(host: CallHost): Input {
  const ns = namespace(host, "input");
  return {
    x: () => ns.int("x"),
    y: () => ns.int("y"),
  };
}
