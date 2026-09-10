import { namespace, type CallHost } from "./base";
import { asBool } from "../protocol";
import type { CallValue, Scalar } from "../types";

/**
 * `var` — the Stonescript `var` dictionary shared with the in-game script.
 *
 * These accessors are never cached: the in-game script can change a variable
 * between two reads inside the same step.
 */
export interface Variable {
  get(key: string): Promise<CallValue>;
  set(key: string, value: Scalar): Promise<void>;
  has(key: string): Promise<boolean>;
}

export function createVariable(host: CallHost): Variable {
  const ns = namespace(host, "var");
  return {
    get: (key) => ns.live("get", key),
    set: (key, value) => ns.invoke("set", key, value),
    has: async (key) => asBool(await ns.live("has", key)),
  };
}
