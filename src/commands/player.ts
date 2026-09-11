/**
 * The `player` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `player` — the player character.
 *
 * @see {@link Position} for where the player is,
 * {@link SSRPGInterface.hp} for how healthy they are.
 */
export interface Player {
  /**
   * Reads `player.direction`.
   *
   * @returns The direction the player faces: positive for right, negative for
   * left.
   */
  direction(): Promise<number | null>;

  /**
   * Reads `player.framesPerMove`.
   *
   * @returns How many frames the player needs to move one tile, which is the
   * inverse of movement speed.
   */
  framesPerMove(): Promise<number | null>;

  /**
   * Reads `player.name`.
   *
   * @returns The player's name.
   */
  name(): Promise<string | null>;

  /**
   * Calls `player.GetNextLegendName`.
   *
   * @returns The name the next legend will be given.
   */
  GetNextLegendName(): Promise<string | null>;

  /**
   * Calls `player.ShowScaredFace` — makes the player pull a scared face.
   *
   * @param time - How long to hold the expression, in frames.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  ShowScaredFace(time: number): Promise<void>;
}

/**
 * Builds the {@link Player} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `player`.
 */
export function createPlayer(host: CallHost): Player {
  const ns = namespace(host, "player");
  return {
    direction: () => ns.int("direction"),
    framesPerMove: () => ns.int("framesPerMove"),
    name: () => ns.str("name"),
    GetNextLegendName: () => ns.str("GetNextLegendName"),
    ShowScaredFace: (time) => ns.invoke("ShowScaredFace", time),
  };
}
