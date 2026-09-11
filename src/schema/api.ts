/**
 * The type-level registry of the StoneScript API.
 *
 * @remarks
 * {@link StoneScriptAPI} maps every readable variable and callable function to
 * its argument list and return type, which is what lets
 * {@link SSRPGInterface.call} reject unknown names and narrow results. Member
 * families that differ only by one segment — both hands, both clocks, all four
 * buff collections — are generated with template literal types rather than
 * listed out.
 *
 * Return types are taken from the "Returns" annotations in
 * {@link https://stonestoryrpg.com/stonescript/beta.html | the Stonescript
 * manual} (beta, v4.27.1).
 *
 * Members returning StoneScript objects — `math.BigNumber`, the `ui`, `anim`
 * and `canvas` namespaces — are deliberately absent: MindConnect carries only
 * integers, booleans and strings, so there is no way to hand one back.
 *
 * @packageDocumentation
 */
import type { AbilityId, AmbientId, KeyAction, KeyName, Loose, MusicId, SoundId } from "./ids";
import type { Scalar } from "../types";

/**
 * A StoneScript float.
 *
 * @remarks
 * The protocol is untyped and {@link autoCast} only converts integer literals,
 * so a fractional value arrives as a numeric string. The template literal type
 * says exactly that, and `Number(value)` gets you a number.
 *
 * @example
 * ```ts
 * const raw = await ssrpg.call("math.Sqrt", 2); // `${number}` | null
 * const root = raw === null ? null : Number(raw);
 * ```
 */
export type Float = `${number}`;

/**
 * A value the manual documents as "number": an integer, or a float that
 * arrived as a {@link Float} string.
 */
export type Decimal = number | Float;

/** Any scalar StoneScript can store and hand back. */
export type StoredValue = string | number | boolean;

/**
 * A StoneScript array, flattened.
 *
 * @remarks
 * The protocol has no array type, so `storage.Keys()`, `string.Split()` and
 * friends arrive as a single joined string.
 */
export type Joined = string;

/** The colour names the manual documents as presets. */
export type ColorPreset =
  | "red"
  | "green"
  | "blue"
  | "cyan"
  | "magenta"
  | "yellow"
  | "white"
  | "black";

/**
 * A colour: `#rrggbb` hexadecimal, or a `#`-prefixed preset.
 *
 * @remarks
 * Permissive about the digits so it stays a plain type, but it still catches
 * the common mistake of leaving off the `#`. For exact validation of the six
 * hex digits, use {@link StrictColor}.
 */
export type Color = `#${ColorPreset}` | (`#${string}` & {});

/** A hexadecimal digit, in either case. */
export type HexDigit =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "a" | "b" | "c" | "d" | "e" | "f"
  | "A" | "B" | "C" | "D" | "E" | "F";

/**
 * Validates a colour literal down to the individual digits.
 *
 * @remarks
 * Resolves to `S` when `S` is a `#`-prefixed preset or exactly six hex digits,
 * and to `never` otherwise. Never built as a union — 22 digits over six
 * positions would be 113 million members — so it works by inferring the six
 * characters and checking each one.
 *
 * @typeParam S - The literal to validate.
 *
 * @example
 * ```ts
 * declare function tint<S extends string>(color: StrictColor<S>): void;
 * tint("#ff00ff"); // ok
 * tint("#red");    // ok
 * tint("#ff00f");  // Argument of type '"#ff00f"' is not assignable to 'never'
 * ```
 */
export type StrictColor<S extends string> = S extends `#${ColorPreset}`
  ? S
  : S extends `#${infer A}${infer B}${infer C}${infer D}${infer E}${infer F}`
    ? [A, B, C, D, E, F] extends [HexDigit, HexDigit, HexDigit, HexDigit, HexDigit, HexDigit]
      ? S
      : never
    : never;

/** A tuple of call arguments. */
export type ArgList = readonly (Scalar | undefined)[];

/**
 * A readable variable: no arguments, one return type.
 *
 * @remarks
 * Exported so {@link StoneScriptAPI} can be extended by declaration merging.
 *
 * @typeParam T - The declared return type.
 */
export interface Read<T> {
  /** A variable takes no arguments. */
  args: [];
  /** What reading it yields. */
  returns: T;
}

/**
 * A callable function.
 *
 * @typeParam A - The argument list, or a union of them for several arities.
 * @typeParam T - The declared return type.
 */
export interface Fn<A extends ArgList, T> {
  /** The arguments the function takes. */
  args: A;
  /** What calling it yields. */
  returns: T;
}

/**
 * A function called for its side effect, which yields no value.
 *
 * @typeParam A - The argument list, or a union of them for several arities.
 */
export interface Act<A extends ArgList = []> {
  /** The arguments the function takes. */
  args: A;
  /** Side-effecting calls yield nothing. */
  returns: null;
}

// --- families ----------------------------------------------------------

/** The two hands an item can occupy. */
type Hand = "left" | "right";

/** The four buff collections: the player's two and the target foe's two. */
type BuffScope = "buffs" | "debuffs" | "foe.buffs" | "foe.debuffs";

/** The two clocks that expose calendar fields. */
type Clock = "time" | "utc";

/** Calendar fields shared by both clocks. */
type ClockField = "year" | "month" | "day" | "hour" | "minute" | "second";

/** The resources the player carries. */
type ResourceName = "stone" | "wood" | "tar" | "ki" | "bronze" | "crystals";

/** `item.left` and `item.right`, plus their members. */
type ItemHandAPI = { [K in `item.${Hand}`]: Read<string> } & {
  [K in `item.${Hand}.id`]: Read<string>;
} & { [K in `item.${Hand}.${"gp" | "state" | "time"}`]: Read<number> };

/** The members every buff collection shares, plus the player-only `oldest`. */
type BuffAPI = { [K in `${BuffScope}.count`]: Read<number> } & {
  [K in `${BuffScope}.string`]: Read<string>;
} & { [K in `${BuffScope}.${"GetCount" | "GetTime"}`]: Fn<[buffName: string], number> } & {
  [K in `${"buffs" | "debuffs"}.oldest`]: Read<string>;
};

/** Calendar fields on both the local and the UTC clock. */
type ClockAPI = { [K in `${Clock}.${ClockField}`]: Read<number> };

/** One entry per carried resource. */
type ResourceAPI = { [K in `res.${ResourceName}`]: Read<number> };

/** The player's movement vectors. */
type MovementAPI = {
  [K in `player.${"moveX" | "moveZ" | "moveAddX" | "moveAddZ"}`]: Read<number>;
};

/** The four world/screen coordinate conversions. */
type ScreenConvertAPI = {
  [K in `screen.${"FromWorldX" | "FromWorldZ" | "ToWorldX" | "ToWorldZ"}`]: Fn<
    [value: number],
    number
  >;
};

/** The single-argument `math` functions that return a possibly-fractional number. */
type MathUnaryAPI = {
  [K in `math.${
    | "Abs"
    | "Acos"
    | "Asin"
    | "Atan"
    | "Ceil"
    | "Cos"
    | "Exp"
    | "Floor"
    | "Round"
    | "Sign"
    | "Sin"
    | "Sqrt"
    | "Tan"
    | "ToDeg"
    | "ToRad"}`]: Fn<[value: number], Decimal>;
};

/** The `math` functions that round to a true integer. */
type MathToIntAPI = {
  [K in `math.${"CeilToInt" | "FloorToInt" | "RoundToInt"}`]: Fn<[value: number], number>;
};

/** The `te` translation functions, which all take and return one string. */
type TranslateAPI = {
  [K in `te.${"xt" | "GetTID" | "ToEnglish"}`]: Fn<[text: string], string>;
};

/** The two frame-to-text formatters. */
type TimeFormatAPI = {
  [K in `time.${"FormatCasual" | "FormatDigital"}`]: Fn<
    [frames: number] | [frames: number, compact: boolean],
    string
  >;
};

/** The `key` lookups that resolve an action to a key. */
type KeyLookupAPI = {
  [K in `key.${"GetActKey" | "GetActKey2" | "GetActLabel"}`]: Fn<[action: KeyAction], string>;
};

// --- the registry ------------------------------------------------------

/**
 * Every StoneScript name MindConnect can read or call, with its arguments and
 * return type.
 *
 * @remarks
 * Extend this through declaration merging when the game adds a member before
 * this library catches up:
 *
 * ```ts
 * declare module "ssrpg-bun" {
 *   interface StoneScriptAPI {
 *     "foe.newThing": { args: []; returns: number };
 *   }
 * }
 * ```
 */
export interface StoneScriptAPI
  extends ItemHandAPI,
    BuffAPI,
    ClockAPI,
    ResourceAPI,
    MovementAPI,
    ScreenConvertAPI,
    MathUnaryAPI,
    MathToIntAPI,
    TranslateAPI,
    TimeFormatAPI,
    KeyLookupAPI {
  // location
  /**
   * The current location the player is visiting.
   *
   * @see `loc` in the Stonescript manual.
   */
  loc: Read<string>;
  /**
   * The unique identifier of the current location.
   *
   * @see `loc.id` in the Stonescript manual.
   */
  "loc.id": Read<string>;
  /**
   * The localized name of the current location.
   *
   * @see `loc.name` in the Stonescript manual.
   */
  "loc.name": Read<string>;
  /**
   * The total gear power used during the current run.
   *
   * @see `loc.gp` in the Stonescript manual.
   */
  "loc.gp": Read<number>;
  /**
   * The current location's difficulty.
   *
   * @see `loc.stars` in the Stonescript manual.
   */
  "loc.stars": Read<number>;
  /**
   * Is true only on the first frame of a location, when time = 0, before any
   * game simulation has run.
   *
   * @see `loc.begin` in the Stonescript manual.
   */
  "loc.begin": Read<boolean>;
  /**
   * Is true on the first frame of a run after an Ouroboros loop.
   *
   * @see `loc.loop` in the Stonescript manual.
   */
  "loc.loop": Read<boolean>;
  /**
   * True if the current location is a special location from a Legend or
   * custom quest.
   *
   * @see `loc.isQuest` in the Stonescript manual.
   */
  "loc.isQuest": Read<boolean>;
  /**
   * The current location's average completion time.
   *
   * @see `loc.averageTime` in the Stonescript manual.
   */
  "loc.averageTime": Read<number>;
  /**
   * The current location's best completion time (your record, high-score).
   *
   * @see `loc.bestTime` in the Stonescript manual.
   */
  "loc.bestTime": Read<number>;
  /**
   * Causes the run to be abandoned as if the player had pressed to leave
   * manually.
   *
   * @see `loc.Leave` in the Stonescript manual.
   */
  "loc.Leave": Act;
  /**
   * Causes the run to be paused as if the player had pressed the pause button
   * manually.
   *
   * @see `loc.Pause` in the Stonescript manual.
   */
  "loc.Pause": Act;

  // encounter
  /**
   * Tells you if the current encounter is an elite encounter or not.
   *
   * @see `encounter.isElite` in the Stonescript manual.
   */
  "encounter.isElite": Read<boolean>;
  /**
   * Tells you the special modifier, if any, for the current encounter.
   *
   * @see `encounter.eliteMod` in the Stonescript manual.
   */
  "encounter.eliteMod": Read<string>;

  // foe
  /**
   * The current foe being targeted by the player.
   *
   * @see `foe` in the Stonescript manual.
   */
  foe: Read<string>;
  /**
   * The unique ID (or type) of the foe being targeted by the player.
   *
   * @see `foe.id` in the Stonescript manual.
   */
  "foe.id": Read<string>;
  /**
   * The localized name of the foe being targeted by the player.
   *
   * @see `foe.name` in the Stonescript manual.
   */
  "foe.name": Read<string>;
  /**
   * The damage per attack of the foe being targeted by the player.
   *
   * @see `foe.damage` in the Stonescript manual.
   */
  "foe.damage": Read<number>;
  /**
   * The distance between the player and the foe being targeted.
   *
   * @see `foe.distance` in the Stonescript manual.
   */
  "foe.distance": Read<number>;
  /**
   * The z position of the foe being targeted.
   *
   * @see `foe.z` in the Stonescript manual.
   */
  "foe.z": Read<number>;
  /**
   * The number of foes within 46 units of the player.
   *
   * @see `foe.count` in the Stonescript manual.
   */
  "foe.count": Read<number>;
  /**
   * The number of foes within a specific number of units.
   *
   * @see `foe.GetCount` in the Stonescript manual.
   */
  "foe.GetCount": Fn<[distance: number], number>;
  /**
   * The current hitpoints of the foe being targeted by the player.
   *
   * @see `foe.hp` in the Stonescript manual.
   */
  "foe.hp": Read<number>;
  /**
   * The maximum hitpoints of the foe being targeted by the player.
   *
   * @see `foe.maxhp` in the Stonescript manual.
   */
  "foe.maxhp": Read<number>;
  /**
   * The current armor of the foe being targeted by the player.
   *
   * @see `foe.armor` in the Stonescript manual.
   */
  "foe.armor": Read<number>;
  /**
   * The maximum armor of the foe being targeted by the player.
   *
   * @see `foe.maxarmor` in the Stonescript manual.
   */
  "foe.maxarmor": Read<number>;
  /**
   * A number representing the target foe's current state.
   *
   * @see `foe.state` in the Stonescript manual.
   */
  "foe.state": Read<number>;
  /**
   * Elapsed number of frames in target foe's current state.
   *
   * @see `foe.time` in the Stonescript manual.
   */
  "foe.time": Read<number>;
  /**
   * The level number of the target foe.
   *
   * @see `foe.level` in the Stonescript manual.
   */
  "foe.level": Read<number>;

  // world objects
  /**
   * The next harvestable object, such as a tree or boulder.
   *
   * @see `harvest` in the Stonescript manual.
   */
  harvest: Read<string>;
  /**
   * The distance between the player and the nearest harvestable object.
   *
   * @see `harvest.distance` in the Stonescript manual.
   */
  "harvest.distance": Read<number>;
  /**
   * The z position of the nearest harvestable object.
   *
   * @see `harvest.z` in the Stonescript manual.
   */
  "harvest.z": Read<number>;
  /**
   * The current pickup being targeted by the player.
   *
   * @see `pickup` in the Stonescript manual.
   */
  pickup: Read<string>;
  /**
   * The distance between the player and the pickup being targeted.
   *
   * @see `pickup.distance` in the Stonescript manual.
   */
  "pickup.distance": Read<number>;
  /**
   * The z position of the pickup being targeted.
   *
   * @see `pickup.z` in the Stonescript manual.
   */
  "pickup.z": Read<number>;

  // input
  /**
   * The X position, on the ASCII grid, of the input device (mouse/touch).
   *
   * @see `input.x` in the Stonescript manual.
   */
  "input.x": Read<number>;
  /**
   * The Y position, on the ASCII grid, of the input device (mouse/touch).
   *
   * @see `input.y` in the Stonescript manual.
   */
  "input.y": Read<number>;
  /**
   * The state of custom game input.
   *
   * @see `key` in the Stonescript manual.
   */
  key: Read<string>;
  /**
   * Assigns a new set of keys to a specific action.
   *
   * @see `key.Bind` in the Stonescript manual.
   */
  "key.Bind": Act<[action: KeyAction, key1: Loose<KeyName>] | [action: KeyAction, key1: Loose<KeyName>, key2: Loose<KeyName>]>;
  /**
   * Returns the action bound to a given key.
   *
   * @see `key.GetKeyAct` in the Stonescript manual.
   */
  "key.GetKeyAct": Fn<[key: Loose<KeyName>], string>;
  /**
   * Resets all actions to their default key bindings.
   *
   * @see `key.ResetBinds` in the Stonescript manual.
   */
  "key.ResetBinds": Act;

  // items
  /**
   * The potion currently brewed.
   *
   * @see `item.potion` in the Stonescript manual.
   */
  "item.potion": Read<string>;
  /**
   * Returns true if it's possible to activate item abilities.
   *
   * @see `item.CanActivate` in the Stonescript manual.
   */
  "item.CanActivate": Fn<[] | [itemName: Loose<AbilityId>], boolean>;
  /**
   * Returns the remaining cooldown time (in frames) for a given ability.
   *
   * @see `item.GetCooldown` in the Stonescript manual.
   */
  "item.GetCooldown": Fn<[ability: Loose<AbilityId>], number>;
  /**
   * Returns the number of copies of an item in the inventory.
   *
   * @see `item.GetCount` in the Stonescript manual.
   */
  "item.GetCount": Fn<[criteria: string], number>;
  /**
   * Returns the items in a specific loadout.
   *
   * @see `item.GetLoadoutL` in the Stonescript manual.
   */
  "item.GetLoadoutL": Fn<[loadout: number], string>;
  /**
   * Returns the items in a specific loadout.
   *
   * @see `item.GetLoadoutR` in the Stonescript manual.
   */
  "item.GetLoadoutR": Fn<[loadout: number], string>;
  /**
   * Returns the current number of treasure chests in your inventory.
   *
   * @see `item.GetTreasureCount` in the Stonescript manual.
   */
  "item.GetTreasureCount": Fn<[], number>;
  /**
   * Returns the total space for treasure chests in your inventory.
   *
   * @see `item.GetTreasureLimit` in the Stonescript manual.
   */
  "item.GetTreasureLimit": Fn<[], number>;

  // player vitals
  /**
   * The player's current hitpoints.
   *
   * @see `hp` in the Stonescript manual.
   */
  hp: Read<number>;
  /**
   * The player's maximum hitpoints.
   *
   * @see `maxhp` in the Stonescript manual.
   */
  maxhp: Read<number>;
  /**
   * The player's current armor, rounded down.
   *
   * @see `armor` in the Stonescript manual.
   */
  armor: Read<number>;
  /**
   * The player's current armor's fractional amount.
   *
   * @see `armor.f` in the Stonescript manual.
   */
  "armor.f": Read<Decimal>;
  /**
   * The player's maximum armor, rounded down.
   *
   * @see `maxarmor` in the Stonescript manual.
   */
  maxarmor: Read<number>;
  /**
   * True if the player has Big Head enabled (Moondial).
   *
   * @see `bighead` in the Stonescript manual.
   */
  bighead: Read<boolean>;
  /**
   * The player's current facial expression.
   *
   * @see `face` in the Stonescript manual.
   */
  face: Read<string>;
  /**
   * The total "Gear Power" of your inventory, calculated from item star
   * levels and enchantment bonuses.
   *
   * @see `totalgp` in the Stonescript manual.
   */
  totalgp: Read<number>;
  /**
   * The player's current X position.
   *
   * @see `pos.x` in the Stonescript manual.
   */
  "pos.x": Read<number>;
  /**
   * The player's current Y position.
   *
   * @see `pos.y` in the Stonescript manual.
   */
  "pos.y": Read<number>;
  /**
   * The player's current Z position.
   *
   * @see `pos.z` in the Stonescript manual.
   */
  "pos.z": Read<number>;

  // player
  /**
   * The name chosen by the player.
   *
   * @see `player.name` in the Stonescript manual.
   */
  "player.name": Read<string>;
  /**
   * Indicates the direction in which the player is facing.
   *
   * @see `player.direction` in the Stonescript manual.
   */
  "player.direction": Read<number>;
  /**
   * The amount of frames it takes the player to move one position forward.
   *
   * @see `player.framesPerMove` in the Stonescript manual.
   */
  "player.framesPerMove": Read<number>;
  /**
   * The next unlocked Legend quest the player hasn't completed yet.
   *
   * @see `player.GetNextLegendName` in the Stonescript manual.
   */
  "player.GetNextLegendName": Fn<[], string>;
  /**
   * If the player has big-head enabled, their facial expression will change
   * to scared for a given amount of time.
   *
   * @see `player.ShowScaredFace` in the Stonescript manual.
   */
  "player.ShowScaredFace": Act<[frames: number]>;

  // ai
  /**
   * True if the AI is on, False if the AI is off (e.g.
   *
   * @see `ai.enabled` in the Stonescript manual.
   */
  "ai.enabled": Read<boolean>;
  /**
   * True if the AI is temporarily suspended, such as when waiting for a
   * treasure to drop.
   *
   * @see `ai.paused` in the Stonescript manual.
   */
  "ai.paused": Read<boolean>;
  /**
   * True if the player is idle, waiting for something such as an attack to
   * complete.
   *
   * @see `ai.idle` in the Stonescript manual.
   */
  "ai.idle": Read<boolean>;
  /**
   * True if the player is moving.
   *
   * @see `ai.walking` in the Stonescript manual.
   */
  "ai.walking": Read<boolean>;

  // time and randomness
  /**
   * The current frame number of the location.
   *
   * @see `time` in the Stonescript manual.
   */
  time: Read<number>;
  /**
   * The current frame number of the location, accumulated in case of boss
   * sub-location.
   *
   * @see `totaltime` in the Stonescript manual.
   */
  totaltime: Read<number>;
  /**
   * Unix time represents the number of milliseconds that have elapsed since
   * 1970-01-01T00:00:00Z (January 1, 1970, at 12:00 AM UTC).
   *
   * @see `time.msbn` in the Stonescript manual.
   */
  "time.msbn": Read<Joined>;
  /**
   * Returns a random integer between 0 and 9999.
   *
   * @see `rng` in the Stonescript manual.
   */
  rng: Read<number>;
  /**
   * Returns a random floating-point number between 0 and 1.
   *
   * @see `rngf` in the Stonescript manual.
   */
  rngf: Read<Decimal>;

  // screen and drawing
  /**
   * The screen's position in-game, as an index that increses when the player
   * reaches the right-side and it slides over.
   *
   * @see `screen.i` in the Stonescript manual.
   */
  "screen.i": Read<number>;
  /**
   * The screen's position in-game.
   *
   * @see `screen.x` in the Stonescript manual.
   */
  "screen.x": Read<number>;
  /**
   * The width of the screen's ASCII grid.
   *
   * @see `screen.w` in the Stonescript manual.
   */
  "screen.w": Read<number>;
  /**
   * The height of the screen's ASCII grid.
   *
   * @see `screen.h` in the Stonescript manual.
   */
  "screen.h": Read<number>;
  /**
   * For locations that are multi-screen, moves the camera one screen forward
   * in relation to the player.
   *
   * @see `screen.Next` in the Stonescript manual.
   */
  "screen.Next": Act;
  /**
   * For locations that are multi-screen, moves the camera one screen back in
   * relation to the player.
   *
   * @see `screen.Previous` in the Stonescript manual.
   */
  "screen.Previous": Act;
  "screen.ResetOffset": Act;
  /**
   * Clears the entire screen.
   *
   * @see `draw.Clear` in the Stonescript manual.
   */
  "draw.Clear": Act;
  /**
   * Draws the player character, with all equipment and addons, at a specific
   * point in the script.
   *
   * @see `draw.Player` in the Stonescript manual.
   */
  "draw.Player": Act<[] | [x: number, y: number]>;
  /**
   * Sets the background color at a specific screen position.
   *
   * @see `draw.Bg` in the Stonescript manual.
   */
  "draw.Bg": Act<
    [x: number, y: number, color: Color] | [x: number, y: number, color: Color, w: number, h: number]
  >;
  /**
   * Draws a rectangular shape at the specified position and size.
   *
   * @see `draw.Box` in the Stonescript manual.
   */
  "draw.Box": Act<[x: number, y: number, w: number, h: number, color: Color, style: number]>;
  /**
   * Returns the glyph at screen position (x, y).
   *
   * @see `draw.GetSymbol` in the Stonescript manual.
   */
  "draw.GetSymbol": Fn<[x: number, y: number], string>;

  // summons
  /**
   * The number of summoned allies currently in game.
   *
   * @see `summon.count` in the Stonescript manual.
   */
  "summon.count": Read<number>;
  /**
   * Returns the ID of the summon at a given index.
   *
   * @see `summon.GetId` in the Stonescript manual.
   */
  "summon.GetId": Fn<[] | [index: number], string>;
  /**
   * Returns the localized name of the summon at a given index.
   *
   * @see `summon.GetName` in the Stonescript manual.
   */
  "summon.GetName": Fn<[] | [index: number], string>;
  /**
   * Returns the value for a custom variable on a summon.
   *
   * @see `summon.GetVar` in the Stonescript manual.
   */
  "summon.GetVar": Fn<[varName: string] | [varName: string, index: number], number>;
  /**
   * Returns a number representing the current state of a summon.
   *
   * @see `summon.GetState` in the Stonescript manual.
   */
  "summon.GetState": Fn<[] | [index: number], number>;
  /**
   * Returns the elapsed number of frames in the current state of a summon.
   *
   * @see `summon.GetTime` in the Stonescript manual.
   */
  "summon.GetTime": Fn<[] | [index: number], number>;

  // events
  /**
   * Returns information about active objectives in a community or seasonal
   * event.
   *
   * @see `event.GetObjectiveId` in the Stonescript manual.
   */
  "event.GetObjectiveId": Fn<[index: number], string>;
  /**
   * How far the objective at the given index has progressed.
   */
  "event.GetObjectiveProgress": Fn<[index: number], number>;
  /**
   * The value the objective at the given index has to reach.
   */
  "event.GetObjectiveGoal": Fn<[index: number], number>;

  // audio
  /**
   * Returns the ID of the currently playing music.
   *
   * @see `music` in the Stonescript manual.
   */
  music: Read<string>;
  /**
   * Plays a music, with the given sound ID.
   *
   * @see `music.Play` in the Stonescript manual.
   */
  "music.Play": Act<[track: Loose<MusicId>]>;
  "music.Stop": Act;
  /**
   * Returns a comma-separated list of all active ambient audio IDs.
   *
   * @see `ambient` in the Stonescript manual.
   */
  ambient: Read<string>;
  /**
   * Adds a layer of ambient audio, with the given sound ID.
   *
   * @see `ambient.Add` in the Stonescript manual.
   */
  "ambient.Add": Act<[sound: Loose<AmbientId>]>;
  /**
   * Clears all ambient layers.
   *
   * @see `ambient.Stop` in the Stonescript manual.
   */
  "ambient.Stop": Act;

  // colour
  /**
   * Converts a color from three integer numbers (0 to 255) into a string.
   *
   * @see `color.FromRGB` in the Stonescript manual.
   */
  "color.FromRGB": Fn<[r: number, g: number, b: number], Color>;
  /**
   * Converts a color from string to three integer numbers (0 to 255).
   *
   * @see `color.ToRGB` in the Stonescript manual.
   */
  "color.ToRGB": Fn<[color: Color], Joined>;
  /**
   * Interpolates linearly between two colours, `t` running from 0 to 1.
   */
  "color.Lerp": Fn<[from: Color, to: Color, t: number], Color>;
  /**
   * Returns a random color.
   *
   * @see `color.Random` in the Stonescript manual.
   */
  "color.Random": Fn<[], Color>;

  // shared variables
  /**
   * Reads a variable from the Stonescript `var` dictionary shared with the
   * in-game script. A MindConnect accessor rather than a Stonescript member.
   */
  "var.get": Fn<[key: string], StoredValue>;
  /**
   * Writes a variable into the Stonescript `var` dictionary shared with the
   * in-game script. A MindConnect accessor rather than a Stonescript member.
   */
  "var.set": Act<[key: string, value: Scalar]>;
  /**
   * Whether the in-game script has a variable of that name. A MindConnect
   * accessor rather than a Stonescript member.
   */
  "var.has": Fn<[key: string], boolean>;

  // persistent storage
  /**
   * Retrieves a permanent value stored at the specified key.
   *
   * @see `storage.Get` in the Stonescript manual.
   */
  "storage.Get": Fn<[key: string] | [key: string, defaultValue: Scalar], StoredValue>;
  /**
   * Saves a value to permanent storage at a specified key.
   *
   * @see `storage.Set` in the Stonescript manual.
   */
  "storage.Set": Act<[key: string, value: Scalar]>;
  /**
   * Whether permanent storage holds a value at the specified key.
   */
  "storage.Has": Fn<[key: string], boolean>;
  /**
   * Deletes any value that may exist at the specified key.
   *
   * @see `storage.Delete` in the Stonescript manual.
   */
  "storage.Delete": Act<[key: string]>;
  /**
   * Increases by 1 the value stored at the specified key, then returns the
   * new value.
   *
   * @see `storage.Incr` in the Stonescript manual.
   */
  "storage.Incr": Fn<[key: string] | [key: string, amount: number], number>;
  /**
   * Retrieves an array of strings containing all the storage keys available
   * in the current context.
   *
   * @see `storage.Keys` in the Stonescript manual.
   */
  "storage.Keys": Fn<[], Joined>;

  // strings
  /**
   * Breaks a string into multiple strings, given a max width.
   *
   * @see `string.Break` in the Stonescript manual.
   */
  "string.Break": Fn<[text: string, width: number], Joined>;
  /**
   * Changes the first letter of a string to be upper-case.
   *
   * @see `string.Capitalize` in the Stonescript manual.
   */
  "string.Capitalize": Fn<[text: string], string>;
  /**
   * Takes two string parameters and returns true if they are exactly the
   * same.
   *
   * @see `string.Equals` in the Stonescript manual.
   */
  "string.Equals": Fn<[a: string, b: string], boolean>;
  /**
   * Modifies a string by replacing format-templates with the values of the
   * other parameters, then returns the final composed string.
   *
   * @see `string.Format` in the Stonescript manual.
   */
  "string.Format": Fn<[template: string, ...values: Scalar[]], string>;
  /**
   * Takes a string variable and a string criteria as parameters and finds the
   * position of the criteria inside the string.
   *
   * @see `string.IndexOf` in the Stonescript manual.
   */
  "string.IndexOf": Fn<
    [text: string, criteria: string] | [text: string, criteria: string, startAt: number],
    number
  >;
  /**
   * Takes a string variable as parameter and calculates how long it is, in
   * number of glyphs.
   *
   * @see `string.Size` in the Stonescript manual.
   */
  "string.Size": Fn<[text: string], number>;
  /**
   * Breaks a string into an array of strings on the given separator. Arrives
   * as one joined string, since the protocol has no array type.
   */
  "string.Split": Fn<[text: string] | [text: string, separator: string], Joined>;
  /**
   * Takes a string variable and a starting index as parameters and splits the
   * string from that point forward.
   *
   * @see `string.Sub` in the Stonescript manual.
   */
  "string.Sub": Fn<
    [text: string, startAt: number] | [text: string, startAt: number, length: number],
    string
  >;
  /**
   * Changes all letters in a string to lower-case.
   *
   * @see `string.ToLower` in the Stonescript manual.
   */
  "string.ToLower": Fn<[text: string], string>;
  /**
   * Changes all letters in a string to upper-case.
   *
   * @see `string.ToUpper` in the Stonescript manual.
   */
  "string.ToUpper": Fn<[text: string], string>;

  // maths
  /**
   * The constant e, approximately 2.7182818.
   */
  "math.e": Read<Decimal>;
  /**
   * The constant pi, approximately 3.1415926.
   */
  "math.pi": Read<Decimal>;
  /**
   * The angle, in radians, between the x-axis and the line from the origin to
   * the point (x, y).
   */
  "math.Atan2": Fn<[y: number, x: number], Decimal>;
  /**
   * Constrains a number to within the range 'min' and 'max'.
   *
   * @see `math.Clamp` in the Stonescript manual.
   */
  "math.Clamp": Fn<[value: number, min: number, max: number], Decimal>;
  /**
   * Interpolates linearly from `from` to `to`, `t` running from 0 to 1.
   */
  "math.Lerp": Fn<[from: number, to: number, t: number], Decimal>;
  /**
   * Returns the logarithm of a number at a given base.
   *
   * @see `math.Log` in the Stonescript manual.
   */
  "math.Log": Fn<[value: number, base: number], Decimal>;
  /**
   * Returns the largest of the two numbers.
   *
   * @see `math.Max` in the Stonescript manual.
   */
  "math.Max": Fn<[a: number, b: number], Decimal>;
  /**
   * Returns the smallest of the two numbers.
   *
   * @see `math.Min` in the Stonescript manual.
   */
  "math.Min": Fn<[a: number, b: number], Decimal>;
  /**
   * Returns the number raised to a power.
   *
   * @see `math.Pow` in the Stonescript manual.
   */
  "math.Pow": Fn<[value: number, power: number], Decimal>;

  // parsing and reflection
  /**
   * Converts a string of a number into an integer value.
   *
   * @see `int.Parse` in the Stonescript manual.
   */
  "int.Parse": Fn<[text: string], number>;
  /**
   * Evaluates the type of a variable and returns a string representation.
   *
   * @see `Type` in the Stonescript manual.
   */
  Type: Fn<[value: Scalar], string>;

  // localisation
  /**
   * The code for the language selected by the player in settings.
   *
   * @see `te.language` in the Stonescript manual.
   */
  "te.language": Read<string>;

  // system and ui
  /**
   * The user's operating system, such as "Android", "iOS", "Linux", "OSX" or
   * "Windows".
   *
   * @see `sys.os` in the Stonescript manual.
   */
  "sys.os": Read<string>;
  /**
   * Whether the game is running on a desktop platform.
   */
  "sys.isPC": Read<boolean>;
  /**
   * Whether the game is running on a mobile platform.
   */
  "sys.isMobile": Read<boolean>;
  /**
   * Getter for the current file path to be used when importing scripts.
   *
   * @see `sys.fileUrl` in the Stonescript manual.
   */
  "sys.fileUrl": Read<string>;
  /**
   * Indicates if files imported remotely should be cached between runs.
   *
   * @see `sys.cacheRemoteFiles` in the Stonescript manual.
   */
  "sys.cacheRemoteFiles": Read<boolean>;
  /**
   * Changes where imported scripts are loaded from.
   */
  "sys.SetFileUrl": Act<[url: string]>;
  /**
   * Removes all UI elements from the main container.
   *
   * @see `ui.Clear` in the Stonescript manual.
   */
  "ui.Clear": Act;
  /**
   * Opens the inventory screen.
   *
   * @see `ui.OpenInv` in the Stonescript manual.
   */
  "ui.OpenInv": Act;
  /**
   * Opens the Mind Stone screen.
   *
   * @see `ui.OpenMind` in the Stonescript manual.
   */
  "ui.OpenMind": Act;
  /**
   * Displays the animated banner with up to two messages.
   *
   * @see `ui.ShowBanner` in the Stonescript manual.
   */
  "ui.ShowBanner": Act<[message: string] | [message: string, submessage: string]>;
}

// --- queued commands ---------------------------------------------------

/** The HUD element flags accepted by `enable hud` and `disable hud`. */
export type HudFlag = "p" | "f" | "a" | "r" | "b" | "u";

/**
 * Validates a run of {@link HudFlag} letters, in any order.
 *
 * @remarks
 * Resolves to `S` when every character is a HUD flag, and `never` otherwise.
 * Enumerating the combinations would mean every permutation of every subset,
 * so this walks the literal one character at a time instead.
 *
 * @typeParam S - The flag string to validate.
 *
 * @example
 * ```ts
 * type Ok = HudOpts<"ru">;  // "ru"
 * type No = HudOpts<"rx">;  // never
 * ```
 */
export type HudOpts<S extends string> = S extends ""
  ? never
  : ValidateHudOpts<S> extends true
    ? S
    : never;

/**
 * Recursive half of {@link HudOpts}: peels one character at a time and checks
 * it against {@link HudFlag}.
 *
 * @typeParam S - The remaining characters.
 */
export type ValidateHudOpts<S extends string> = S extends ""
  ? true
  : S extends `${infer Head}${infer Rest}`
    ? Head extends HudFlag
      ? ValidateHudOpts<Rest>
      : false
    : false;

/** The features `enable` and `disable` can toggle as a whole. */
export type ToggleFeature =
  | "abilities"
  | "banner"
  | "hud"
  | "loadout input"
  | "loadout print"
  | "npcDialog"
  | "pause"
  | "player";

/** What the `activate` command accepts: a hand, the potion, or an ability. */
export type ActivateTarget = "R" | "L" | "P" | "right" | "left" | "potion" | Loose<AbilityId>;

/**
 * One criterion of an item search.
 *
 * @remarks
 * A name fragment, a {@link SearchFilter} tag, a `*n` star level, a `+n`
 * enchantment bonus, or any of those negated with `-`.
 */
export type ItemCriteria = Loose<
  import("./ids").SearchFilter | `*${number}` | `+${number}` | `-${string}`
>;

/**
 * The commands that are queued during a step and flushed as one batch.
 *
 * @remarks
 * Each carries a single pre-joined payload, which is what the wire format
 * expects. {@link CommandQueue} builds those payloads for you.
 */
export interface StoneScriptCommands {
  ">": Act<[payload: string]>;
  /**
   * Plays a sound effect with an optional pitch value.
   *
   * @see `play` in the Stonescript manual.
   */
  play: Act<[payload: string]>;
  /**
   * Equips an item to whichever hand fits best, from up to 7 search criteria.
   * Two-handed items must use this form.
   */
  equip: Act<[payload: string]>;
  /**
   * Equips an item to the left hand that best fits the given criteria.
   *
   * @see `equipL` in the Stonescript manual.
   */
  equipL: Act<[payload: string]>;
  /**
   * Equips an item to the right hand that best fits the given criteria.
   *
   * @see `equipR` in the Stonescript manual.
   */
  equipR: Act<[payload: string]>;
  /**
   * Equips a specific loadout number.
   *
   * @see `loadout` in the Stonescript manual.
   */
  loadout: Act<[payload: string]>;
  /**
   * Activates an item ability.
   *
   * @see `activate` in the Stonescript manual.
   */
  activate: Act<[payload: string]>;
  /**
   * Restores a game feature that was turned off with `disable`.
   */
  enable: Act<[payload: string]>;
  /**
   * Turns a game feature off.
   */
  disable: Act<[payload: string]>;
  /**
   * Refills the potion bottle to the specified combination of ingredients.
   *
   * @see `brew` in the Stonescript manual.
   */
  brew: Act<[payload: string]>;
}
