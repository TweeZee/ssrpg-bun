import { namespace, type CallHost } from "./base";

/** `encounter` — information about the current encounter. */
export interface Encounter {
  isElite(): Promise<boolean>;
  eliteMod(): Promise<string | null>;
}

export function createEncounter(host: CallHost): Encounter {
  const ns = namespace(host, "encounter");
  return {
    isElite: () => ns.bool("isElite"),
    eliteMod: () => ns.str("eliteMod"),
  };
}
