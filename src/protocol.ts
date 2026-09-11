/**
 * MindConnect protocol v0.3 — wire format helpers.
 *
 * @remarks
 * Packets are text frames whose fields are separated by {@link US}, the ASCII
 * unit separator (`\x1f`). Three kinds of frame exist:
 *
 * | Direction | Shape |
 * | --- | --- |
 * | Request (client → game) | `<requestId> <count> ( <argc> <name> ( <tag> <arg> )* )*` |
 * | Response (game → client) | `<requestId> ( <value> )*` — one value per request, no trailing separator |
 * | Signal (game → client) | {@link SIGNAL} followed by an optional `pre`/`post` and the protocol version |
 *
 * The client also sends a bare {@link EOF} byte to mean "my step is finished,
 * resume the game".
 *
 * `<tag>` is `i` for integers and `s` for strings. Queued commands
 * ({@link QUEUE_COMMANDS}) are the exception: they carry a single pre-joined
 * payload and no type tags.
 *
 * @packageDocumentation
 */
import { ProtocolError } from "./errors";
import type { CallValue, Request, Scalar, StepContext, StepSignal } from "./types";

/** Field separator: the ASCII unit separator (`\x1f`). */
export const US = "\x1f";

/** Prefix of a step signal: the ASCII acknowledge character (`\x06`). */
export const SIGNAL = "\x06";

/** End-of-step marker sent by the client: the ASCII end-of-text character (`\x03`). */
export const EOF = "\x03";

/**
 * The protocol version this implementation speaks.
 *
 * @remarks
 * Requires Stone Story RPG v4.25.0 or above. A game reporting a different
 * version is logged once as a warning; see
 * {@link SSRPGInterfaceOptions.warnOnVersionMismatch}.
 */
export const PROTOCOL_VERSION = "0.3";

/** Exclusive upper bound for request ids, which wrap back around to 0. */
export const MAX_REQUEST_ID = 10_000;

/**
 * Names that are sent as queued commands rather than variable or function
 * calls.
 *
 * @remarks
 * Commands carry a single pre-joined payload string and no type tags. The
 * `>` entry is StoneScript's print command.
 *
 * @see {@link CommandQueue} for the typed wrappers around these names.
 */
export const QUEUE_COMMANDS: ReadonlySet<string> = new Set([
  ">",
  "play",
  "equipR",
  "equipL",
  "equip",
  "loadout",
  "activate",
  "enable",
  "disable",
  "brew",
]);

/** Matches a value that StoneScript would treat as an integer literal. */
const INTEGER_RE = /^-?\d+$/;

/** Matches a step signal: the marker, an optional context and a version. */
const SIGNAL_RE = /^\x06(pre|post)?(\d+\.\d+)/;

/**
 * Serializes one request batch into a wire packet.
 *
 * @param requestId - Id the response will be tagged with. Callers should keep
 * ids unique among the requests currently in flight.
 * @param requests - The batch to send; must not contain empty requests.
 * @returns The packet, ready to be encoded as UTF-8 and written to the socket.
 * @throws {@link ProtocolError} if a request is not a non-empty array.
 *
 * @example
 * ```ts
 * buildPacket(1, [["draw.GetSymbol", 10, 5]]);
 * // "1␟1␟2␟draw.GetSymbol␟i␟10␟i␟5"
 * ```
 */
export function buildPacket(requestId: number, requests: readonly Request[]): string {
  const parts: string[] = [String(requestId), String(requests.length)];

  for (const request of requests) {
    if (!Array.isArray(request) || request.length === 0) {
      throw new ProtocolError(
        `Invalid request format: ${JSON.stringify(request)}. Requests must be non-empty arrays.`,
      );
    }

    const [name, ...args] = request as [string, ...Scalar[]];
    parts.push(String(args.length));

    if (QUEUE_COMMANDS.has(name)) {
      // Commands are untagged: the payload is already a single joined string.
      parts.push(name, ...args.map(String));
      continue;
    }

    parts.push(name);
    for (const arg of args) {
      if (typeof arg === "boolean") {
        parts.push("i", arg ? "1" : "0");
      } else if (typeof arg === "number" && Number.isInteger(arg)) {
        parts.push("i", String(arg));
      } else {
        parts.push("s", String(arg));
      }
    }
  }

  return parts.join(US);
}

/**
 * Converts a raw wire value to the closest JavaScript type.
 *
 * @remarks
 * The protocol is untyped, so values are converted by shape:
 *
 * - `"True"` and `"False"` become booleans.
 * - Integer literals become numbers, unless they exceed
 *   `Number.MAX_SAFE_INTEGER`, in which case they stay strings so no precision
 *   is lost.
 * - Everything else — including decimals such as `"3.5"` — stays a string.
 *
 * @param raw - The field as received, or `null` for a missing value.
 * @returns The converted value, or `null` when `raw` was `null`.
 */
export function autoCast(raw: string | null): CallValue {
  if (raw === null) return null;
  if (raw === "True") return true;
  if (raw === "False") return false;
  if (INTEGER_RE.test(raw)) {
    const value = Number(raw);
    // Keep oversized integers as strings rather than losing precision.
    return Number.isSafeInteger(value) ? value : raw;
  }
  return raw;
}

/**
 * Narrows a call result to an integer.
 *
 * @param value - A value produced by {@link autoCast}.
 * @returns The number, or `null` when the game had no value or returned
 * something that is not an integer.
 */
export function asInt(value: CallValue): number | null {
  return typeof value === "number" ? value : null;
}

/**
 * Narrows a call result to a boolean.
 *
 * @remarks
 * Anything that is not exactly `true` is reported as `false`, mirroring
 * StoneScript, where a missing value is falsy.
 *
 * @param value - A value produced by {@link autoCast}.
 * @returns Whether the game returned `True`.
 */
export function asBool(value: CallValue): boolean {
  return value === true;
}

/**
 * Narrows a call result to a string.
 *
 * @param value - A value produced by {@link autoCast}.
 * @returns The value stringified, or `null` when the game had no value.
 */
export function asStr(value: CallValue): string | null {
  return value === null ? null : String(value);
}

/** The outcome of a successful {@link parseSignal} call. */
export interface ParsedSignal {
  /** The signal that was read. */
  signal: StepSignal;
  /** How many characters of the buffer the signal occupied. */
  consumed: number;
}

/**
 * Parses a step signal at the start of a receive buffer.
 *
 * @param buffer - Buffered text beginning with {@link SIGNAL}.
 * @returns The signal plus the number of characters it consumed, or `null`
 * when `buffer` does not yet hold a complete signal.
 *
 * @example
 * ```ts
 * parseSignal("\x06pre0.3");
 * // { signal: { context: "pre", version: "0.3" }, consumed: 7 }
 * ```
 */
export function parseSignal(buffer: string): ParsedSignal | null {
  const match = SIGNAL_RE.exec(buffer);
  if (!match) return null;

  const context = (match[1] ?? "exclusive") as StepContext;
  return {
    signal: { context, version: match[2]! },
    consumed: match[0].length,
  };
}
