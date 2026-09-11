/**
 * A Bun/TypeScript interface for Stone Story RPG.
 *
 * @remarks
 * Port of the Python `ssrpgif` library by ArtificialPotato, speaking
 * MindConnect protocol {@link PROTOCOL_VERSION | v0.3} (Stone Story RPG
 * v4.25.0 or above).
 *
 * Start at {@link SSRPGInterface} — it owns the connection, the per-step cache
 * and the command queue, and exposes one namespace per StoneScript class.
 * {@link MindConnectClient} sits underneath if you want the protocol without
 * the conveniences, and the {@link buildPacket | protocol helpers} are
 * exported for tooling and tests.
 *
 * {@link StoneScriptAPI} is the type-level model of the game's own API. It is
 * what lets {@link SSRPGInterface.call} reject a name the game does not have
 * and narrow the result to that member's type, and it can be extended by
 * declaration merging when the game moves ahead of this library.
 *
 * @example
 * ```ts
 * import { SSRPGInterface } from "ssrpg-bun";
 *
 * const ssrpg = new SSRPGInterface({ mode: "sync" });
 * await ssrpg.connect();
 *
 * await ssrpg.run(async (context) => {
 *   if (context !== "pre") return;
 *   ssrpg.print("hello bun!", { x: 1, y: 1 });
 *   if ((await ssrpg.foe.hp()) === 1) ssrpg.loc.Pause();
 * });
 * ```
 *
 * @packageDocumentation
 */
export { SSRPGInterface } from "./interface";
export type { RunOptions, SSRPGInterfaceOptions, StepFunction } from "./interface";
export { MindConnectClient } from "./client";
export type { ClientOptions } from "./client";
export * from "./errors";
export * from "./types";
export type { ParsedSignal } from "./protocol";
export {
  autoCast,
  asBool,
  asInt,
  asStr,
  buildPacket,
  parseSignal,
  EOF,
  MAX_REQUEST_ID,
  PROTOCOL_VERSION,
  QUEUE_COMMANDS,
  SIGNAL,
  US,
} from "./protocol";
export * from "./commands/index";
export * from "./schema/index";
