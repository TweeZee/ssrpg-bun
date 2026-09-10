/** Base class for every error raised by this library. */
export class MindConnectError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

/** The TCP connection to the game could not be established. */
export class ConnectFailedError extends MindConnectError {}

/** The connection was closed (by the game, by us, or by an error). */
export class ConnectionClosedError extends MindConnectError {}

/** The game sent something that does not fit the MindConnect protocol. */
export class ProtocolError extends MindConnectError {}

/** A request was not answered within `requestTimeoutMs`. */
export class RequestTimeoutError extends MindConnectError {}

/** An operation was used in a mode that does not support it. */
export class ModeError extends MindConnectError {}
