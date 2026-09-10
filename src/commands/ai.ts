import { namespace, type CallHost } from "./base";

/** `ai` — state of the in-game auto-pilot. */
export interface AI {
  enabled(): Promise<boolean>;
  paused(): Promise<boolean>;
  idle(): Promise<boolean>;
  walking(): Promise<boolean>;
}

export function createAI(host: CallHost): AI {
  const ns = namespace(host, "ai");
  return {
    enabled: () => ns.bool("enabled"),
    paused: () => ns.bool("paused"),
    idle: () => ns.bool("idle"),
    walking: () => ns.bool("walking"),
  };
}
