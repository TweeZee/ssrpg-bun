/**
 * Re-exports every StoneScript namespace wrapper.
 *
 * @remarks
 * One module per StoneScript class, each exporting an interface describing the
 * class and a `create*` factory that binds it to a {@link CallHost}.
 * {@link SSRPGInterface} wires them all up, so you normally reach them through
 * `ssrpg.foe`, `ssrpg.item` and friends rather than importing from here.
 *
 * @packageDocumentation
 */
export * from "./base";
export * from "./command";
export * from "./ai";
export * from "./armor";
export * from "./buffs";
export * from "./debuffs";
export * from "./draw";
export * from "./encounter";
export * from "./event";
export * from "./foe";
export * from "./harvest";
export * from "./input";
export * from "./item";
export * from "./key";
export * from "./loc";
export * from "./pickup";
export * from "./player";
export * from "./pos";
export * from "./res";
export * from "./screen";
export * from "./storage";
export * from "./summon";
export * from "./te";
export * from "./var";
