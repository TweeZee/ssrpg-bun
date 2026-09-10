/**
 * Shared types for the MindConnect protocol.
 */

/**
 * Operation mode. Must match the `//MindConnect: [mode]` header of the
 * in-game Stonescript.
 *
 * - `sync`      – the script runs alongside an in-game Stonescript. Every game
 *                 frame produces a `pre` and a `post` step.
 * - `exclusive` – the script owns the game logic. One step per frame.
 * - `async`     – fire-and-forget requests, no step signals.
 */
export type Mode = "sync" | "async" | "exclusive";

/** Which half of a game frame a step callback is running in. */
export type StepContext = "pre" | "post" | "exclusive";

/** A value that can be sent as an argument of a call or command. */
export type Scalar = string | number | boolean;

/** A value returned by StoneScript, after conversion. `null` means "no value". */
export type CallValue = string | number | boolean | null;

/** A single request: a variable/function name followed by its arguments. */
export type Request = readonly [name: string, ...args: Scalar[]];

/** A step signal received from the game. */
export interface StepSignal {
  context: StepContext;
  /** Protocol version reported by the game, e.g. `"0.3"`. */
  version: string;
}
