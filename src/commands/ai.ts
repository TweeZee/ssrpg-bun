/**
 * The `ai` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `ai` — state of the in-game auto-pilot.
 *
 * @remarks
 * Useful in `sync` mode to tell whether the in-game script is currently
 * driving the character, so your script can stay out of its way.
 */
export interface AI {
  /**
   * Reads `ai.enabled`.
   *
   * @returns Whether the auto-pilot is switched on.
   */
  enabled(): Promise<boolean>;

  /**
   * Reads `ai.paused`.
   *
   * @returns Whether the auto-pilot is paused.
   */
  paused(): Promise<boolean>;

  /**
   * Reads `ai.idle`.
   *
   * @returns Whether the auto-pilot currently has nothing to do.
   */
  idle(): Promise<boolean>;

  /**
   * Reads `ai.walking`.
   *
   * @returns Whether the auto-pilot is walking.
   */
  walking(): Promise<boolean>;
}

/**
 * Builds the {@link AI} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `ai`.
 */
export function createAI(host: CallHost): AI {
  const ns = namespace(host, "ai");
  return {
    enabled: () => ns.bool("enabled"),
    paused: () => ns.bool("paused"),
    idle: () => ns.bool("idle"),
    walking: () => ns.bool("walking"),
  };
}
