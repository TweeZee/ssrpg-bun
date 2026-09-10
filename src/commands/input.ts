import { namespace, type CallHost } from "./base";

/** `input` — the player's pointer position. */
export interface Input {
  x(): Promise<number | null>;
  y(): Promise<number | null>;
}

export function createInput(host: CallHost): Input {
  const ns = namespace(host, "input");
  return {
    x: () => ns.int("x"),
    y: () => ns.int("y"),
  };
}
