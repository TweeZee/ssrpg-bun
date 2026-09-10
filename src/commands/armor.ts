import { callable, namespace, type CallHost } from "./base";

/** `armor` — the player's armour. Call it to read the current value. */
export interface Armor {
  (): Promise<number | null>;
  /** `armor.f` — armour as a fraction of the maximum, in percent. */
  f(): Promise<number | null>;
}

export function createArmor(host: CallHost): Armor {
  const ns = namespace(host, "armor");
  return callable(() => ns.int(""), {
    f: () => ns.int("f"),
  }) satisfies Armor;
}
