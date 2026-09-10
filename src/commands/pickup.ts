import { callable, namespace, type CallHost } from "./base";

/** `pickup` — the nearest item on the ground. Call it to read its name. */
export interface Pickup {
  (): Promise<string | null>;
  distance(): Promise<number | null>;
  z(): Promise<number | null>;
}

export function createPickup(host: CallHost): Pickup {
  const ns = namespace(host, "pickup");
  return callable(() => ns.str(""), {
    distance: () => ns.int("distance"),
    z: () => ns.int("z"),
  }) satisfies Pickup;
}
