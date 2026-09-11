/**
 * Error types raised by this library.
 *
 * @remarks
 * Every error extends {@link MindConnectError}, so a single `instanceof` check
 * separates protocol problems from bugs in your own script.
 *
 * @packageDocumentation
 */

/**
 * Base class for every error raised by this library.
 *
 * @example
 * ```ts
 * try {
 *   await ssrpg.run(step);
 * } catch (error) {
 *   if (error instanceof MindConnectError) console.error(error.message);
 *   else throw error;
 * }
 * ```
 */
export class MindConnectError extends Error {
  /**
   * @param message - Human-readable description of the failure.
   * @param options - Standard error options; `cause` carries the underlying
   * socket or parse error where there is one.
   */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

/**
 * The TCP connection to the game could not be established.
 *
 * @remarks
 * Usually means the game is not running, the mindstone is not enabled, or the
 * Stonescript is missing its `//MindConnect: [mode]` header. `cause` holds the
 * original socket error, such as `ECONNREFUSED`.
 *
 * @see {@link SSRPGInterface.connect}
 */
export class ConnectFailedError extends MindConnectError {}

/**
 * The connection was closed — by the game, by {@link SSRPGInterface.disconnect},
 * or by a socket error.
 *
 * @remarks
 * Every request in flight and any pending {@link SSRPGInterface.step} rejects
 * with this error. {@link SSRPGInterface.run} treats it as a normal end of the
 * session and returns instead of rethrowing.
 */
export class ConnectionClosedError extends MindConnectError {}

/**
 * The game sent something that does not fit the MindConnect protocol.
 *
 * @remarks
 * Raised for malformed step signals, non-numeric request ids, responses for
 * unknown request ids, and unsolicited data. The connection is closed, because
 * the byte stream can no longer be framed reliably.
 */
export class ProtocolError extends MindConnectError {}

/**
 * A request was not answered within the configured request timeout.
 *
 * @see {@link ClientOptions.requestTimeoutMs}
 */
export class RequestTimeoutError extends MindConnectError {}

/**
 * An operation was used in a {@link Mode} that does not support it, or an
 * unknown mode was requested.
 *
 * @remarks
 * {@link SSRPGInterface.step} requires `sync` or `exclusive`;
 * {@link SSRPGInterface.callAsync} requires `async`.
 */
export class ModeError extends MindConnectError {}
