import { callable, namespace, type CallHost } from "./base";

/** `loc` — the current location. Call it to read its name. */
export interface Loc {
  (): Promise<string | null>;
  id(): Promise<string | null>;
  name(): Promise<string | null>;
  stars(): Promise<number | null>;
  /** `true` during the first frame of a location. */
  begin(): Promise<boolean>;
  /** `true` when the location has looped. */
  loop(): Promise<boolean>;
  bestTime(): Promise<number | null>;
  averageTime(): Promise<number | null>;
  isQuest(): Promise<boolean>;
  gp(): Promise<number | null>;
  /** Queues `loc.Leave` for the end of the step. */
  Leave(): void;
  /** Queues `loc.Pause` for the end of the step. */
  Pause(): void;
}

export function createLoc(host: CallHost): Loc {
  const ns = namespace(host, "loc");
  return callable(() => ns.str(""), {
    id: () => ns.str("id"),
    name: () => ns.str("name"),
    stars: () => ns.int("stars"),
    begin: () => ns.bool("begin"),
    loop: () => ns.bool("loop"),
    bestTime: () => ns.int("bestTime"),
    averageTime: () => ns.int("averageTime"),
    isQuest: () => ns.bool("isQuest"),
    gp: () => ns.int("gp"),
    Leave: () => ns.queue("Leave"),
    Pause: () => ns.queue("Pause"),
  }) satisfies Loc;
}
