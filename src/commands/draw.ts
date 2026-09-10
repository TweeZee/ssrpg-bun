import { namespace, type CallHost } from "./base";

/** `draw` — direct drawing on the game screen. */
export interface Draw {
  Clear(): Promise<void>;
  /** Draws the player, optionally at an explicit screen position. */
  Player(x?: number, y?: number): Promise<void>;
  /** Fills a background cell, or a `w` x `h` block starting at it. */
  Bg(x: number, y: number, color: string, w?: number, h?: number): Promise<void>;
  Box(x: number, y: number, w: number, h: number, color: string, style: number): Promise<void>;
  /** Reads the symbol currently drawn at a screen position. */
  GetSymbol(x: number, y: number): Promise<string | null>;
}

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
