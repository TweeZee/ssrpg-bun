import { callable, namespace, type CallHost } from "./base";

/** `item.left` / `item.right` — one equipped item. Call it to read its name. */
export interface Head {
  (): Promise<string | null>;
  id(): Promise<string | null>;
  state(): Promise<number | null>;
  time(): Promise<number | null>;
  gp(): Promise<number | null>;
}

/** `item` — the player's inventory and equipped items. */
export interface Item {
  /** Whether the given item (or the best candidate) can be activated now. */
  CanActivate(itemName?: string): Promise<boolean>;
  GetCooldown(itemName: string): Promise<number | null>;
  GetCount(itemName: string): Promise<number | null>;
  GetTreasureCount(): Promise<number | null>;
  GetTreasureLimit(): Promise<number | null>;
  potion(): Promise<string | null>;
  GetLoadoutL(loadout: number): Promise<string | null>;
  GetLoadoutR(loadout: number): Promise<string | null>;
  readonly left: Head;
  readonly right: Head;
}

export function createHead(host: CallHost, className: string): Head {
  const ns = namespace(host, className);
  return callable(() => ns.str(""), {
    id: () => ns.str("id"),
    state: () => ns.int("state"),
    time: () => ns.int("time"),
    gp: () => ns.int("gp"),
  }) satisfies Head;
}

export function createItem(host: CallHost): Item {
  const ns = namespace(host, "item");
  return {
    CanActivate: (itemName) =>
      itemName === undefined ? ns.bool("CanActivate") : ns.bool("CanActivate", itemName),
    GetCooldown: (itemName) => ns.int("GetCooldown", itemName),
    GetCount: (itemName) => ns.int("GetCount", itemName),
    GetTreasureCount: () => ns.int("GetTreasureCount"),
    GetTreasureLimit: () => ns.int("GetTreasureLimit"),
    potion: () => ns.str("potion"),
    GetLoadoutL: (loadout) => ns.str("GetLoadoutL", loadout),
    GetLoadoutR: (loadout) => ns.str("GetLoadoutR", loadout),
    left: createHead(host, "item.left"),
    right: createHead(host, "item.right"),
  };
}
