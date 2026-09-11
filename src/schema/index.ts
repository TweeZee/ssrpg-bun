/**
 * Types derived from the StoneScript API registry.
 *
 * @remarks
 * These are what the typed surface of {@link SSRPGInterface} is built from:
 * {@link CallName} restricts which names can be called, {@link ArgsOf} supplies
 * the argument list for the name you passed, and {@link ResultOf} narrows the
 * result to that member's own type instead of the untyped {@link CallValue}.
 *
 * @packageDocumentation
 */
import type { ArgList, StoneScriptAPI, StoneScriptCommands } from "./api";
import type { CallValue } from "../types";

export * from "./ids";
export * from "./api";

/**
 * Every name {@link SSRPGInterface.call} accepts.
 *
 * @remarks
 * A union of about 250 string literals, so editors autocomplete it and typos
 * are a compile error.
 */
export type CallName = keyof StoneScriptAPI & string;

/** Every name the queue accepts: a callable member or a queued command. */
export type QueueName = (keyof StoneScriptAPI | keyof StoneScriptCommands) & string;

/** The ten commands that are queued and flushed at the end of a step. */
export type CommandName = keyof StoneScriptCommands & string;

/**
 * The argument list a given member expects.
 *
 * @typeParam N - The member name.
 *
 * @example
 * ```ts
 * type A = ArgsOf<"foe.GetCount">; // [distance: number]
 * type B = ArgsOf<"foe.hp">;       // []
 * ```
 */
export type ArgsOf<N extends CallName> = StoneScriptAPI[N]["args"];

/** The argument list a queueable name expects. */
export type QueueArgsOf<N extends QueueName> = (StoneScriptAPI & StoneScriptCommands)[N]["args"];

/**
 * What a given member resolves to, including how it can be absent.
 *
 * @remarks
 * Booleans stay `boolean`, because the protocol reports a missing boolean as
 * false. Everything else gains `| null`, since the game returns no value for
 * things like {@link Foe.distance} with no foe on screen. Side-effecting
 * functions resolve to `null`.
 *
 * @typeParam N - The member name.
 *
 * @example
 * ```ts
 * type A = ResultOf<"foe.hp">;      // number | null
 * type B = ResultOf<"loc.begin">;   // boolean
 * type C = ResultOf<"math.Sqrt">;   // number | `${number}` | null
 * type D = ResultOf<"draw.Clear">;  // null
 * ```
 */
export type ResultOf<N extends CallName> = Nullable<StoneScriptAPI[N]["returns"]>;

/**
 * Adds the absent case to a declared return type.
 *
 * @remarks
 * Booleans and side-effecting calls are left alone; everything else gains
 * `| null`.
 *
 * @typeParam T - The declared return type.
 */
export type Nullable<T> = [T] extends [boolean] ? boolean : [T] extends [null] ? null : T | null;

/**
 * A request whose name is known and whose arguments match it.
 *
 * @remarks
 * A union over every member, so `["foe.GetCount", 5]` is accepted while
 * `["foe.GetCount"]` and `["foe.Nope"]` are not.
 */
export type TypedRequest = { [N in CallName]: RequestFor<N> }[CallName];

/**
 * Builds the request tuples for one member, one per documented arity.
 *
 * @remarks
 * Distributes over `A`, so a member with two arities contributes two tuples.
 *
 * @typeParam N - The member name.
 * @typeParam A - Its argument list; do not pass this explicitly.
 */
export type RequestFor<N extends CallName, A = ArgsOf<N>> = A extends ArgList
  ? readonly [name: N, ...A]
  : never;

/**
 * Narrows a batch of requests to a tuple of their individual result types.
 *
 * @remarks
 * This is what makes destructuring a {@link SSRPGInterface.multiCall} result
 * useful: each position carries the type of the request that produced it,
 * rather than a shared {@link CallValue}.
 *
 * @typeParam R - The request tuple, which needs `as const` or a `const` type
 * parameter to stay literal.
 *
 * @example
 * ```ts
 * type R = MultiCallResults<[["foe.name"], ["foe.hp"], ["loc.begin"]]>;
 * // [string | null, number | null, boolean]
 * ```
 */
export type MultiCallResults<R extends readonly unknown[]> = {
  -readonly [K in keyof R]: ResultOfRequest<R[K]>;
};

/**
 * The result type of one entry of a {@link MultiCallResults} tuple.
 *
 * @typeParam T - A request tuple.
 */
export type ResultOfRequest<T> = T extends readonly [infer N, ...unknown[]]
  ? N extends CallName
    ? ResultOf<N>
    : CallValue
  : CallValue;

/**
 * A single member read, written either as a bare name or as a request tuple.
 *
 * @see {@link SSRPGInterface.readAll}
 */
export type ReadSpec = CallName | TypedRequest;

/**
 * The result type of one {@link ReadSpec}.
 *
 * @typeParam S - A bare member name or a request tuple.
 */
export type ResultOfSpec<S> = S extends CallName ? ResultOf<S> : ResultOfRequest<S>;
