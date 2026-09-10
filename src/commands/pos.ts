import { namespace, type CallHost } from "./base";

/** `pos` — the player's world position. */
export interface Position {
  x(): Promise<number | null>;
  y(): Promise<number | null>;
  z(): Promise<number | null>;
}

export function createPosition(host: CallHost): Position {
  const ns = namespace(host, "pos");
  return {
    x: () => ns.int("x"),
    y: () => ns.int("y"),
    z: () => ns.int("z"),
  };
}
