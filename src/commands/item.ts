/**
 * The `item` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";
import type { AbilityId, ItemCriteria, Loose } from "../schema/index";

/**
 * One equipped item, as exposed by `item.left` and `item.right`.
 *
 * @remarks
 * Call the namespace itself to read the item's name, mirroring StoneScript,
 * where `item.left` is both a variable and a class.
 */
export interface Head {
  /**
   * Reads the item's display name.
   *
   * @returns The name, or `null` when the hand is empty.
   */
  (): Promise<string | null>;

  /**
   * Reads `id`.
   *
   * @returns The item's internal id, which is stable across languages.
   */
  id(): Promise<string | null>;

  /**
   * Reads `state`.
   *
   * @returns The item's state code; see the StoneScript documentation for what
   * each value means.
   */
  state(): Promise<number | null>;

  /**
   * Reads `time`.
   *
   * @returns How long the item has been in its current state, in frames.
   */
  time(): Promise<number | null>;

  /**
   * Reads `gp`.
   *
   * @returns The item's value in gold pieces.
   */
  gp(): Promise<number | null>;
}

/**
 * `item` — the player's equipped items and inventory.
 */
export interface Item {
  /**
   * Calls `item.CanActivate`.
   *
   * @param itemName - Item to check. Omit to ask about the best candidate the
   * game would pick on its own.
   * @returns Whether the item can be activated right now.
   *
   * @see {@link CommandQueue.activate}
   */
  CanActivate(itemName?: Loose<AbilityId>): Promise<boolean>;

  /**
   * Calls `item.GetCooldown`.
   *
   * @param ability - Ability id; the documented ids autocomplete.
   * @returns Frames left on the ability's cooldown, `0` when it is ready, or
   * `-1` for an unknown ability or one whose weapon has never been used.
   *
   * @see Appendix A of the Stonescript manual.
   */
  GetCooldown(ability: Loose<AbilityId>): Promise<number | null>;

  /**
   * Calls `item.GetCount`.
   *
   * @param criteria - Search criteria, e.g. `"sword *0 -socket"`.
   * @returns How many matching items the player carries; `0` for none.
   */
  GetCount(criteria: string): Promise<number | null>;

  /**
   * Calls `item.GetTreasureCount`.
   *
   * @returns How many treasures the player is carrying.
   */
  GetTreasureCount(): Promise<number | null>;

  /**
   * Calls `item.GetTreasureLimit`.
   *
   * @returns How many treasures the player can carry.
   */
  GetTreasureLimit(): Promise<number | null>;

  /**
   * Reads `item.potion`.
   *
   * @returns Name of the currently brewed potion, or `null` when there is
   * none.
   *
   * @see {@link CommandQueue.brew}
   */
  potion(): Promise<string | null>;

  /**
   * Calls `item.GetLoadoutL`.
   *
   * @param loadout - Loadout slot to inspect.
   * @returns Name of the left-hand item in that loadout.
   */
  GetLoadoutL(loadout: number): Promise<string | null>;

  /**
   * Calls `item.GetLoadoutR`.
   *
   * @param loadout - Loadout slot to inspect.
   * @returns Name of the right-hand item in that loadout.
   */
  GetLoadoutR(loadout: number): Promise<string | null>;

  /** `item.left` — the item in the left hand. */
  readonly left: Head;

  /** `item.right` — the item in the right hand. */
  readonly right: Head;
}

/**
 * Builds a {@link Head} namespace for one hand.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class to bind to, e.g. `item.left`.
 * @returns Accessors for that hand.
 */
export function createHead(host: CallHost, className: string): Head {
  const ns = namespace(host, className);
  return callable(() => ns.str(""), {
    id: () => ns.str("id"),
    state: () => ns.int("state"),
    time: () => ns.int("time"),
    gp: () => ns.int("gp"),
  }) satisfies Head;
}

/**
 * Builds the {@link Item} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `item`, including both hands.
 */
export function createItem(host: CallHost): Item {
  const ns = namespace(host, "item");
  return {
    CanActivate: (itemName) =>
      itemName === undefined ? ns.bool("CanActivate") : ns.bool("CanActivate", itemName),
    GetCooldown: (ability) => ns.int("GetCooldown", ability),
    GetCount: (criteria) => ns.int("GetCount", criteria),
    GetTreasureCount: () => ns.int("GetTreasureCount"),
    GetTreasureLimit: () => ns.int("GetTreasureLimit"),
    potion: () => ns.str("potion"),
    GetLoadoutL: (loadout) => ns.str("GetLoadoutL", loadout),
    GetLoadoutR: (loadout) => ns.str("GetLoadoutR", loadout),
    left: createHead(host, "item.left"),
    right: createHead(host, "item.right"),
  };
}
