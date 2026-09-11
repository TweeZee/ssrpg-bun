/**
 * The `summon` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `summon` — the player's active summons.
 *
 * @remarks
 * Summons are addressed by index. Every accessor defaults to index `0`, the
 * first summon, and {@link Summon.count} tells you how many there are.
 */
export interface Summon {
  /**
   * Reads `summon.count`.
   *
   * @returns How many summons are active.
   */
  count(): Promise<number | null>;

  /**
   * Calls `summon.GetId`.
   *
   * @param index - Zero-based summon index. Defaults to `0`.
   * @returns The summon's internal id.
   */
  GetId(index?: number): Promise<string | null>;

  /**
   * Calls `summon.GetName`.
   *
   * @param index - Zero-based summon index. Defaults to `0`.
   * @returns The summon's display name.
   */
  GetName(index?: number): Promise<string | null>;

  /**
   * Calls `summon.GetVar`.
   *
   * @param varName - Name of the summon variable to read.
   * @param index - Zero-based summon index. Defaults to `0`.
   * @returns The variable's value.
   */
  GetVar(varName: string, index?: number): Promise<number | null>;

  /**
   * Calls `summon.GetState`.
   *
   * @param index - Zero-based summon index. Defaults to `0`.
   * @returns The summon's state code; see the StoneScript documentation for
   * what each value means.
   */
  GetState(index?: number): Promise<number | null>;

  /**
   * Calls `summon.GetTime`.
   *
   * @param index - Zero-based summon index. Defaults to `0`.
   * @returns How long the summon has been in its current state, in frames.
   */
  GetTime(index?: number): Promise<number | null>;
}

/**
 * Builds the {@link Summon} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `summon`.
 */
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
