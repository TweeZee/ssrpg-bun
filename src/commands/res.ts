import { namespace, type CallHost } from "./base";

/** `res` — the player's resources. */
export interface Resource {
  stone(): Promise<number | null>;
  wood(): Promise<number | null>;
  tar(): Promise<number | null>;
  ki(): Promise<number | null>;
  bronze(): Promise<number | null>;
  crystals(): Promise<number | null>;
}

export function createResource(host: CallHost): Resource {
  const ns = namespace(host, "res");
  return {
    stone: () => ns.int("stone"),
    wood: () => ns.int("wood"),
    tar: () => ns.int("tar"),
    ki: () => ns.int("ki"),
    bronze: () => ns.int("bronze"),
    crystals: () => ns.int("crystals"),
  };
}
