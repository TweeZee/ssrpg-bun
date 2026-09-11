/**
 * What the typed StoneScript surface buys you.
 *
 * @remarks
 * Nothing here connects to the game — the point is that it compiles (and that
 * the lines marked `@ts-expect-error` do not). Run `bun run typecheck` to see
 * it enforced, or open the file in an editor and hover the values.
 */
import { SSRPGInterface } from "../src/index";

const ssrpg = new SSRPGInterface();

// 1. Names are checked, and each result is narrowed to that member's own type.
const hp: number | null = await ssrpg.call("hp");
const foeName: string | null = await ssrpg.call("foe.name");
const starting: boolean = await ssrpg.call("loc.begin");
const symbol: string | null = await ssrpg.call("draw.GetSymbol", 10, 5);

// A float has no integer form on the wire, so a fractional result arrives as a
// numeric string — which the return type says out loud.
const root: number | `${number}` | null = await ssrpg.call("math.Sqrt", 2);
const rounded: number | null = await ssrpg.call("math.RoundToInt", 2.7);

// @ts-expect-error there is no such member
await ssrpg.call("foe.hitpoints");
// @ts-expect-error foe.GetCount needs a distance
await ssrpg.call("foe.GetCount");
// @ts-expect-error and it has to be a number
await ssrpg.call("foe.GetCount", "eight");
// @ts-expect-error foe.hp takes no arguments
await ssrpg.call("foe.hp", 1);

// 2. Template-literal families cover the paths nobody wants to hand-write.
const leftGp: number | null = await ssrpg.call("item.left.gp");
const rightId: string | null = await ssrpg.call("item.right.id");
const crystals: number | null = await ssrpg.call("res.crystals");
const chillLeft: number | null = await ssrpg.call("foe.debuffs.GetTime", "debuff_chill");
const utcHour: number | null = await ssrpg.call("utc.hour");

// @ts-expect-error there is no third hand
await ssrpg.call("item.middle.gp");
// @ts-expect-error nor a 'copper' resource
await ssrpg.call("res.copper");

// 3. A batch keeps one type per position.
const [name, health, begun] = await ssrpg.multiCall([
  ["foe.name"],
  ["foe.hp"],
  ["loc.begin"],
]);
// name: string | null, health: number | null, begun: boolean

// 4. Or read by name, and get an object shaped like the one you asked for.
const state = await ssrpg.readAll({
  hp: "hp",
  foe: "foe.name",
  nearby: ["foe.GetCount", 8],
  starting: "loc.begin",
});
const summary = `${state.foe ?? "nobody"} — ${state.hp ?? 0} hp, ${state.nearby ?? 0} nearby`;

// 5. Commands are checked against what the manual documents.
ssrpg.activate("R");
ssrpg.activate("skeleton_arm");
ssrpg.play("bat_wing", 120);
ssrpg.equip("hammer", "*7", "-socket");
ssrpg.print("careful!", { x: 1, y: 1, color: "#ff0000" });
ssrpg.disable("hud ru"); // resources and utility belt
ssrpg.disable("abilities");

// @ts-expect-error 'x' is not a HUD element flag
ssrpg.disable("hud rx");
// @ts-expect-error not a toggleable feature
ssrpg.disable("gravity");
// @ts-expect-error a colour needs a '#'
ssrpg.print("careful!", { x: 1, y: 1, color: "ff0000" });
// @ts-expect-error a loadout is a number
ssrpg.loadout("1");

// 6. The escape hatch, for a member the schema does not know yet.
const fresh = await ssrpg.callRaw("foe.somethingTheGameJustAdded");

console.log({ hp, foeName, starting, symbol, root, rounded, leftGp, rightId, crystals });
console.log({ chillLeft, utcHour, name, health, begun, summary, fresh });
