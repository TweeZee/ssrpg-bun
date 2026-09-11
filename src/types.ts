/**
 * Shared types for the MindConnect protocol.
 *
 * @packageDocumentation
 */

/**
 * Operation mode of the interface.
 *
 * @remarks
 * The mode must match the `//MindConnect: [mode]` header on the very first
 * line of the in-game Stonescript:
 *
 * - `sync` — the script runs alongside an in-game Stonescript. Every game
 *   frame produces a {@link StepContext | `pre`} step (before the in-game
 *   script runs) and a `post` step (after it).
 * - `exclusive` — the script owns the game logic. One step per frame, always
 *   with the `exclusive` context.
 * - `async` — no step signals at all. Requests are fire-and-forget, and
 *   {@link SSRPGInterface.step} is unavailable.
 *
 * @see {@link SSRPGInterfaceOptions.mode}
 */
export type Mode = "sync" | "async" | "exclusive";

/**
 * Which half of a game frame a step callback is running in.
 *
 * @remarks
 * `pre` and `post` only occur in `sync` mode; `exclusive` mode always reports
 * `exclusive`.
 *
 * @see {@link Mode}
 */
export type StepContext = "pre" | "post" | "exclusive";

/**
 * A value that can be sent as an argument of a call or a command.
 *
 * @remarks
 * Integers are transmitted as StoneScript integers. Non-integer numbers and
 * booleans have no native representation in the protocol: booleans are sent as
 * `1`/`0` and non-integer numbers are stringified.
 */
export type Scalar = string | number | boolean;

/**
 * A value returned by StoneScript, converted to the closest JavaScript type.
 *
 * @remarks
 * `null` means the game had no value for the request — for instance
 * {@link Foe.distance} while no foe is on screen.
 *
 * @see {@link autoCast} for the conversion rules.
 */
export type CallValue = string | number | boolean | null;

/**
 * A single request: a variable or function name followed by its arguments.
 *
 * @example
 * ```ts
 * const requests: Request[] = [
 *   ["foe.name"],                 // read a variable
 *   ["draw.GetSymbol", 10, 5],    // call a function
 *   ["brew", "tar+wood"],         // queue a command
 * ];
 * ```
 */
export type Request = readonly [name: string, ...args: Scalar[]];

/**
 * A step signal received from the game, marking the start of a step.
 *
 * @see {@link MindConnectClient.waitForSignal}
 */
export interface StepSignal {
  /** The half of the frame this step belongs to. */
  context: StepContext;
  /**
   * Protocol version the game reports, for example `"0.3"`.
   *
   * @see {@link PROTOCOL_VERSION} for the version this library speaks.
   */
  version: string;
}
