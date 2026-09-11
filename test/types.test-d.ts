/**
 * Compile-time assertions for the typed StoneScript surface.
 *
 * @remarks
 * Checked by `bun run typecheck`, not by `bun test` — nothing here runs. A
 * broken inference is a compile error, and every `@ts-expect-error` below
 * fails the build if the call it guards ever starts type-checking.
 */
import type {
  ArgsOf,
  MultiCallResults,
  HudOpts,
  ReadSpec,
  ResultOf,
  ResultOfSpec,
  StrictColor,
  TypedRequest,
} from "../src/schema/index";

/** Asserts that two types are mutually assignable. */
type Expect<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;

/** Consumes an assertion, failing the build when it resolved to `never`. */
const assertType = <T extends true>(_assertion: T): void => {};

// --- return narrowing --------------------------------------------------
assertType<Expect<ResultOf<"foe.hp">, number | null>>(true);
assertType<Expect<ResultOf<"foe.name">, string | null>>(true);
assertType<Expect<ResultOf<"loc.begin">, boolean>>(true);
assertType<Expect<ResultOf<"draw.Clear">, null>>(true);
assertType<Expect<ResultOf<"math.Sqrt">, number | `${number}` | null>>(true);
assertType<Expect<ResultOf<"math.RoundToInt">, number | null>>(true);

// --- template-literal families ----------------------------------------
assertType<Expect<ResultOf<"item.left.gp">, number | null>>(true);
assertType<Expect<ResultOf<"item.right.id">, string | null>>(true);
assertType<Expect<ResultOf<"utc.year">, number | null>>(true);
assertType<Expect<ResultOf<"time.minute">, number | null>>(true);
assertType<Expect<ResultOf<"res.crystals">, number | null>>(true);
assertType<Expect<ResultOf<"foe.debuffs.count">, number | null>>(true);
assertType<Expect<ArgsOf<"foe.buffs.GetTime">, [buffName: string]>>(true);
assertType<Expect<ArgsOf<"screen.ToWorldX">, [value: number]>>(true);

// --- argument lists ---------------------------------------------------
assertType<Expect<ArgsOf<"foe.GetCount">, [distance: number]>>(true);
assertType<Expect<ArgsOf<"foe.hp">, []>>(true);

// --- literal validators -----------------------------------------------
assertType<Expect<HudOpts<"ru">, "ru">>(true);
assertType<Expect<HudOpts<"pfarbu">, "pfarbu">>(true);
assertType<Expect<HudOpts<"rx">, never>>(true);
assertType<Expect<HudOpts<"">, never>>(true);
assertType<Expect<StrictColor<"#ff00ff">, "#ff00ff">>(true);
assertType<Expect<StrictColor<"#red">, "#red">>(true);
assertType<Expect<StrictColor<"#ff00f">, never>>(true);
assertType<Expect<StrictColor<"#ff00ffa">, never>>(true);
assertType<Expect<StrictColor<"ff00ff">, never>>(true);
assertType<Expect<StrictColor<"#ff00fz">, never>>(true);

// --- batch narrowing --------------------------------------------------
assertType<
  Expect<
    MultiCallResults<[["foe.name"], ["foe.hp"], ["loc.begin"], ["draw.GetSymbol", 1, 2]]>,
    [string | null, number | null, boolean, string | null]
  >
>(true);
assertType<Expect<ResultOfSpec<"hp">, number | null>>(true);
assertType<Expect<ResultOfSpec<["foe.GetCount", 8]>, number | null>>(true);

// --- request validation -----------------------------------------------
const withArgument: TypedRequest = ["foe.GetCount", 5];
const withoutArguments: TypedRequest = ["foe.hp"];
const optionalArgument: TypedRequest = ["summon.GetId"];
const extraArity: TypedRequest = ["draw.Bg", 1, 2, "#ff0000", 4, 5];
// @ts-expect-error a required argument is missing
const missingArgument: TypedRequest = ["foe.GetCount"];
// @ts-expect-error no such member
const unknownMember: TypedRequest = ["foe.nope"];
// @ts-expect-error the argument has the wrong type
const wrongArgumentType: TypedRequest = ["foe.GetCount", "five"];
// @ts-expect-error too many arguments for this member
const tooManyArguments: TypedRequest = ["foe.hp", 1];
// @ts-expect-error a colour has to start with '#'
const badColor: TypedRequest = ["draw.Bg", 1, 2, "ff0000"];

const bareName: ReadSpec = "totalgp";
// @ts-expect-error no such member
const badBareName: ReadSpec = "total_gp";

void withArgument;
void withoutArguments;
void optionalArgument;
void extraArity;
void missingArgument;
void unknownMember;
void wrongArgumentType;
void tooManyArguments;
void badColor;
void bareName;
void badBareName;
