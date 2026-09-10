import { namespace, type CallHost } from "./base";

/** `player` — the player character. */
export interface Player {
  direction(): Promise<number | null>;
  framesPerMove(): Promise<number | null>;
  name(): Promise<string | null>;
  GetNextLegendName(): Promise<string | null>;
  /** Makes the player pull a scared face for `time` frames. */
  ShowScaredFace(time: number): Promise<void>;
}

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
