/**
 * The `draw` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";
import type { Color } from "../schema/index";

/**
 * `draw` — direct drawing on the game screen.
 *
 * @remarks
 * Unlike {@link CommandQueue.print}, these are immediate calls rather than
 * queued commands, so each one costs a round trip and takes effect straight
 * away. They deliberately bypass the per-step cache, so calling
 * {@link Draw.Clear} twice in one step really clears twice.
 */
export interface Draw {
  /**
   * Calls `draw.Clear` — erases everything drawn this frame.
   *
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Clear(): Promise<void>;

  /**
   * Calls `draw.Player` — draws the player sprite.
   *
   * @param x - Screen column. Omit together with `y` to draw at the player's
   * own position.
   * @param y - Screen row.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Player(x?: number, y?: number): Promise<void>;

  /**
   * Calls `draw.Bg` — fills the background behind a cell or a block of cells.
   *
   * @param x - Screen column of the top-left cell.
   * @param y - Screen row of the top-left cell.
   * @param color - `#rrggbb`, or a preset such as `#red`.
   * @param w - Block width. Omit together with `h` to fill a single cell.
   * @param h - Block height.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Bg(x: number, y: number, color: Color, w?: number, h?: number): Promise<void>;

  /**
   * Calls `draw.Box` — draws a rectangle outline.
   *
   * @param x - Screen column of the top-left corner.
   * @param y - Screen row of the top-left corner.
   * @param w - Width in cells.
   * @param h - Height in cells.
   * @param color - `#rrggbb`, or a preset such as `#red`.
   * @param style - Border style index, as defined by StoneScript.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Box(x: number, y: number, w: number, h: number, color: Color, style: number): Promise<void>;

  /**
   * Calls `draw.GetSymbol` — reads the symbol currently drawn at a position.
   *
   * @param x - Screen column.
   * @param y - Screen row.
   * @returns The single-character symbol, or `null` for an empty cell.
   *
   * @see {@link SSRPGInterface.getScreen} to read a whole block at once.
   */
  GetSymbol(x: number, y: number): Promise<string | null>;
}

/**
 * Builds the {@link Draw} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `draw`.
 */
export function createDraw(host: CallHost): Draw {
  const ns = namespace(host, "draw");
  return {
    Clear: () => ns.invoke("Clear"),
    Player: (x, y) =>
      x === undefined || y === undefined ? ns.invoke("Player") : ns.invoke("Player", x, y),
    Bg: (x, y, color, w, h) =>
      w === undefined || h === undefined
        ? ns.invoke("Bg", x, y, color)
        : ns.invoke("Bg", x, y, color, w, h),
    Box: (x, y, w, h, color, style) => ns.invoke("Box", x, y, w, h, color, style),
    GetSymbol: (x, y) => ns.str("GetSymbol", x, y),
  };
}
