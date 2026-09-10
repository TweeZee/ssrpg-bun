/**
 * MindConnect protocol v0.3 — wire format helpers.
 *
 * Packets are `\x1f`-separated (ASCII unit separator) text frames.
 *
 * Request  (client -> game): `<requestId> <count> ( <argc> <name> ( <tag> <arg> )* )*`
 *                            where `<tag>` is `i` for integers and `s` for strings.
 * Response (game -> client): `<requestId> ( <value> )*` — one value per request,
 *                            with no trailing separator.
 * Signal   (game -> client): `\x06` + optional `pre`/`post` + protocol version.
 * EOF      (client -> game): `\x03` — "my step is finished, resume the game".
 */
import { ProtocolError } from "./errors";
import type { CallValue, Request, Scalar, StepContext, StepSignal } from "./types";

/** Field separator (ASCII unit separator). */
export const US = "\x1f";
/** Prefix of a step signal (ASCII acknowledge). */
export const SIGNAL = "\x06";
/** End-of-step marker sent by the client (ASCII end-of-text). */
export const EOF = "\x03";

/** Protocol version this implementation speaks. */
export const PROTOCOL_VERSION = "0.3";

/** Highest request id before wrapping back around to 0. */
export const MAX_REQUEST_ID = 10_000;

/**
 * Names that are sent as queued *commands* rather than variable/function calls.
 * Commands carry a single pre-joined payload string and no type tags.
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

const INTEGER_RE = /^-?\d+$/;
const SIGNAL_RE = /^\x06(pre|post)?(\d+\.\d+)/;

/** Serializes one request batch into a wire packet. */
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
 * Converts a raw wire value to the closest JavaScript type:
 * `"True"`/`"False"` become booleans, integer literals become numbers,
 * everything else stays a string.
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

/** Narrows a call result to an integer, or `null` when it is not one. */
export function asInt(value: CallValue): number | null {
  return typeof value === "number" ? value : null;
}

/** Narrows a call result to a boolean. Anything that is not `true` is `false`. */
export function asBool(value: CallValue): boolean {
  return value === true;
}

/** Narrows a call result to a string, keeping `null` as `null`. */
export function asStr(value: CallValue): string | null {
  return value === null ? null : String(value);
}

/**
 * Parses a step signal at the start of `buffer`.
 *
 * @returns the signal plus the number of characters it consumed, or `null`
 *          when `buffer` does not (yet) hold a complete signal.
 */
export function parseSignal(buffer: string): { signal: StepSignal; consumed: number } | null {
  const match = SIGNAL_RE.exec(buffer);
  if (!match) return null;

  const context = (match[1] ?? "exclusive") as StepContext;
  return {
    signal: { context, version: match[2]! },
    consumed: match[0].length,
  };
}
