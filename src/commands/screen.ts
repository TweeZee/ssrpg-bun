/**
 * The `screen` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `screen` — the visible viewport, plus conversion between world and screen
 * coordinates.
 *
 * @remarks
 * {@link Screen.Next}, {@link Screen.Previous} and {@link Screen.ResetOffset}
 * are immediate calls that bypass the per-step cache, so calling one twice in
 * a step really scrolls twice.
 */
export interface Screen {
  /**
   * Reads `screen.i`.
   *
   * @returns Index of the screen currently shown.
   */
  i(): Promise<number | null>;

  /**
   * Reads `screen.x`.
   *
   * @returns World column the left edge of the screen sits at.
   */
  x(): Promise<number | null>;

  /**
   * Reads `screen.w`.
   *
   * @returns Screen width in cells.
   */
  w(): Promise<number | null>;

  /**
   * Reads `screen.h`.
   *
   * @returns Screen height in cells.
   */
  h(): Promise<number | null>;

  /**
   * Calls `screen.FromWorldX`.
   *
   * @param value - A world x coordinate.
   * @returns The matching screen column.
   */
  FromWorldX(value: number): Promise<number | null>;

  /**
   * Calls `screen.FromWorldZ`.
   *
   * @param value - A world z coordinate (depth lane).
   * @returns The matching screen row.
   */
  FromWorldZ(value: number): Promise<number | null>;

  /**
   * Calls `screen.ToWorldX`.
   *
   * @param value - A screen column.
   * @returns The matching world x coordinate.
   */
  ToWorldX(value: number): Promise<number | null>;

  /**
   * Calls `screen.ToWorldZ`.
   *
   * @param value - A screen row.
   * @returns The matching world z coordinate.
   */
  ToWorldZ(value: number): Promise<number | null>;

  /**
   * Calls `screen.Next` — scrolls to the next screen.
   *
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Next(): Promise<void>;

  /**
   * Calls `screen.Previous` — scrolls to the previous screen.
   *
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Previous(): Promise<void>;

  /**
   * Calls `screen.ResetOffset` — recentres the view on the player.
   *
   * @returns A promise that settles once the game has acknowledged the call.
   */
  ResetOffset(): Promise<void>;
}

/**
 * Builds the {@link Screen} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `screen`.
 */
export function createScreen(host: CallHost): Screen {
  const ns = namespace(host, "screen");
  return {
    i: () => ns.int("i"),
    x: () => ns.int("x"),
    w: () => ns.int("w"),
    h: () => ns.int("h"),
    FromWorldX: (value) => ns.int("FromWorldX", value),
    FromWorldZ: (value) => ns.int("FromWorldZ", value),
    ToWorldX: (value) => ns.int("ToWorldX", value),
    ToWorldZ: (value) => ns.int("ToWorldZ", value),
    Next: () => ns.invoke("Next"),
    Previous: () => ns.invoke("Previous"),
    ResetOffset: () => ns.invoke("ResetOffset"),
  };
}
