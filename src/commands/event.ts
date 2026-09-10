import { namespace, type CallHost } from "./base";

/** `event` — objectives of the active event. */
export interface Event {
  GetObjectiveId(index: number): Promise<string | null>;
  GetObjectiveProgress(index: number): Promise<number | null>;
  GetObjectiveGoal(index: number): Promise<number | null>;
}

export function createEvent(host: CallHost): Event {
  const ns = namespace(host, "event");
  return {
    GetObjectiveId: (index) => ns.str("GetObjectiveId", index),
    GetObjectiveProgress: (index) => ns.int("GetObjectiveProgress", index),
    GetObjectiveGoal: (index) => ns.int("GetObjectiveGoal", index),
  };
}
