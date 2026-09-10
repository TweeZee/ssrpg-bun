import { namespace, type CallHost } from "./base";

/** `summon` — the player's active summons. */
export interface Summon {
  count(): Promise<number | null>;
  GetId(index?: number): Promise<string | null>;
  GetName(index?: number): Promise<string | null>;
  GetVar(varName: string, index?: number): Promise<number | null>;
  GetState(index?: number): Promise<number | null>;
  GetTime(index?: number): Promise<number | null>;
}

export function createSummon(host: CallHost): Summon {
  const ns = namespace(host, "summon");
  return {
    count: () => ns.int("count"),
    GetId: (index = 0) => ns.str("GetId", index),
    GetName: (index = 0) => ns.str("GetName", index),
    GetVar: (varName, index = 0) => ns.int("GetVar", varName, index),
    GetState: (index = 0) => ns.int("GetState", index),
    GetTime: (index = 0) => ns.int("GetTime", index),
  };
}
