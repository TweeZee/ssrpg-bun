import { callable, namespace, type CallHost } from "./base";

/** `harvest` — the nearest harvestable node. Call it to read its name. */
export interface Harvest {
  (): Promise<string | null>;
  distance(): Promise<number | null>;
  z(): Promise<number | null>;
}

export function createHarvest(host: CallHost): Harvest {
  const ns = namespace(host, "harvest");
  return callable(() => ns.str(""), {
    distance: () => ns.int("distance"),
    z: () => ns.int("z"),
  }) satisfies Harvest;
}
