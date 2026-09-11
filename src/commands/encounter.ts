/**
 * The `encounter` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `encounter` — information about the encounter in progress.
 */
export interface Encounter {
  /**
   * Reads `encounter.isElite`.
   *
   * @returns Whether this is an elite encounter.
   */
  isElite(): Promise<boolean>;

  /**
   * Reads `encounter.eliteMod`.
   *
   * @returns Id of the elite modifier, or `null` outside an elite encounter.
   */
  eliteMod(): Promise<string | null>;
}

/**
 * Builds the {@link Encounter} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `encounter`.
 */
export function createEncounter(host: CallHost): Encounter {
  const ns = namespace(host, "encounter");
  return {
    isElite: () => ns.bool("isElite"),
    eliteMod: () => ns.str("eliteMod"),
  };
}
