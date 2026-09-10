import { namespace, type CallHost } from "./base";
import { asBool, asInt } from "../protocol";
import type { CallValue, Scalar } from "../types";

/**
 * `storage` — the persistent key/value store of the in-game script.
 *
 * @experimental The Python reference implementation never enabled this class
 * (it needs an InvocationContext on the game side).
 */
export interface Storage {
  /** Reads a key, optionally falling back to `defaultValue` in the game. */
  Get(key: string, defaultValue?: Scalar): Promise<CallValue>;
  Set(key: string, value: Scalar): Promise<void>;
  Has(key: string): Promise<boolean>;
  Delete(key: string): Promise<void>;
  Incr(key: string): Promise<number | null>;
  /** All keys currently in the store. */
  Keys(): Promise<string[]>;
}

export function createStorage(host: CallHost): Storage {
  const ns = namespace(host, "storage");
  return {
    Get: (key, defaultValue) =>
      defaultValue === undefined ? ns.live("Get", key) : ns.live("Get", key, defaultValue),
    Set: (key, value) => ns.invoke("Set", key, value),
    Has: async (key) => asBool(await ns.live("Has", key)),
    Delete: (key) => ns.invoke("Delete", key),
    Incr: async (key) => asInt(await ns.live("Incr", key)),
    Keys: async () => {
      const result = await ns.live("Keys");
      return typeof result === "string" && result.length > 0 ? result.split(",") : [];
    },
  };
}
