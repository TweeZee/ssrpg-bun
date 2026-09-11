/**
 * The `event` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `event` — objectives of the active in-game event.
 */
export interface Event {
  /**
   * Calls `event.GetObjectiveId`.
   *
   * @param index - Zero-based objective index.
   * @returns Id of that objective, or `null` when the index is out of range.
   */
  GetObjectiveId(index: number): Promise<string | null>;

  /**
   * Calls `event.GetObjectiveProgress`.
   *
   * @param index - Zero-based objective index.
   * @returns How far the objective has progressed.
   */
  GetObjectiveProgress(index: number): Promise<number | null>;

  /**
   * Calls `event.GetObjectiveGoal`.
   *
   * @param index - Zero-based objective index.
   * @returns The value the objective's progress has to reach.
   */
  GetObjectiveGoal(index: number): Promise<number | null>;
}

/**
 * Builds the {@link Event} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `event`.
 */
export function createEvent(host: CallHost): Event {
  const ns = namespace(host, "event");
  return {
    GetObjectiveId: (index) => ns.str("GetObjectiveId", index),
    GetObjectiveProgress: (index) => ns.int("GetObjectiveProgress", index),
    GetObjectiveGoal: (index) => ns.int("GetObjectiveGoal", index),
  };
}
