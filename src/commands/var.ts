/**
 * The `var` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";
import { asBool } from "../protocol";
import type { CallValue, Scalar } from "../types";

/**
 * `var` — the Stonescript `var` dictionary, shared with the in-game script.
 *
 * @remarks
 * This is the intended channel for two-way communication in `sync` mode: the
 * in-game script and your script both read and write the same keys.
 *
 * None of these accessors are cached, because the in-game script can change a
 * variable between two reads inside the same step. Where Python used
 * subscripting (`ssrpg.var["mode"]`), this port uses methods.
 *
 * @example
 * ```ts
 * if (await ssrpg.var.has("mode")) {
 *   const mode = await ssrpg.var.get("mode");
 *   if (mode === "attack") await ssrpg.var.set("mode", "heal");
 * }
 * ```
 */
export interface Variable {
  /**
   * Calls `var.get`.
   *
   * @param key - Variable name.
   * @returns The value, or `null` when the variable does not exist.
   */
  get(key: string): Promise<CallValue>;

  /**
   * Calls `var.set`.
   *
   * @param key - Variable name.
   * @param value - Value to store. Booleans are sent as `1`/`0`, since the
   * protocol carries only integers and strings.
   * @returns A promise that settles once the game has acknowledged the write.
   */
  set(key: string, value: Scalar): Promise<void>;

  /**
   * Calls `var.has`.
   *
   * @param key - Variable name.
   * @returns Whether the in-game script has that variable.
   */
  has(key: string): Promise<boolean>;
}

/**
 * Builds the {@link Variable} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Uncached accessors for `var`.
 */
export function createVariable(host: CallHost): Variable {
  const ns = namespace(host, "var");
  return {
    get: (key) => ns.live("get", key),
    set: (key, value) => ns.invoke("set", key, value),
    has: async (key) => asBool(await ns.live("has", key)),
  };
}
