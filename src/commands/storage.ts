/**
 * The `storage` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";
import { asBool, asInt } from "../protocol";
import type { CallValue, Scalar } from "../types";

/**
 * `storage` — the persistent key/value store of the in-game script.
 *
 * @remarks
 * Unlike {@link Variable}, these values survive between runs. None of the
 * accessors are cached, so a read after a write sees the new value within the
 * same step.
 *
 * @experimental The Python reference implementation left this class disabled
 * because it needs an InvocationContext on the game side, so the game may not
 * expose it over MindConnect yet.
 */
export interface Storage {
  /**
   * Calls `storage.Get`.
   *
   * @param key - Storage key.
   * @param defaultValue - Value for the game to fall back to when the key is
   * missing.
   * @returns The stored value, or `null` when the key is missing and no
   * fallback was given.
   */
  Get(key: string, defaultValue?: Scalar): Promise<CallValue>;

  /**
   * Calls `storage.Set`.
   *
   * @param key - Storage key.
   * @param value - Value to store.
   * @returns A promise that settles once the game has acknowledged the write.
   */
  Set(key: string, value: Scalar): Promise<void>;

  /**
   * Calls `storage.Has`.
   *
   * @param key - Storage key.
   * @returns Whether the store holds that key.
   */
  Has(key: string): Promise<boolean>;

  /**
   * Calls `storage.Delete`.
   *
   * @param key - Storage key to remove.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Delete(key: string): Promise<void>;

  /**
   * Calls `storage.Incr` — increments a counter.
   *
   * @param key - Storage key to increment.
   * @returns The value after incrementing.
   */
  Incr(key: string): Promise<number | null>;

  /**
   * Calls `storage.Keys`.
   *
   * @returns Every key in the store. Empty when the store is empty, since the
   * game returns the keys as one comma-separated string.
   */
  Keys(): Promise<string[]>;
}

/**
 * Builds the {@link Storage} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Uncached accessors for `storage`.
 *
 * @experimental See {@link Storage}.
 */
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
