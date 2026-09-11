/**
 * The low-level MindConnect client.
 *
 * @packageDocumentation
 */
import type { Socket } from "bun";
import {
  ConnectFailedError,
  ConnectionClosedError,
  MindConnectError,
  ProtocolError,
  RequestTimeoutError,
} from "./errors";
import { buildPacket, EOF, MAX_REQUEST_ID, parseSignal, SIGNAL, US, autoCast } from "./protocol";
import type { CallValue, Request, StepSignal } from "./types";

/**
 * Connection settings for {@link MindConnectClient}.
 *
 * @remarks
 * {@link SSRPGInterfaceOptions} extends this, so the same settings can be
 * passed straight to {@link SSRPGInterface}.
 */
export interface ClientOptions {
  /**
   * Host the game listens on.
   *
   * @defaultValue `"127.0.0.1"`
   */
  hostname?: string;

  /**
   * TCP port the game's MindConnect server listens on.
   *
   * @defaultValue `64649`
   */
  port?: number;

  /**
   * How long to wait for the TCP connection, in milliseconds. `0` waits
   * indefinitely.
   *
   * @defaultValue `10_000`
   */
  connectTimeoutMs?: number;

  /**
   * How long to wait for a response, in milliseconds. `0` disables the
   * timeout.
   *
   * @remarks
   * This does not apply to {@link MindConnectClient.waitForSignal}, which
   * waits indefinitely — a paused or backgrounded game can go a long time
   * without producing a frame.
   *
   * @defaultValue `10_000`
   */
  requestTimeoutMs?: number;
}

/** A request that has been sent and is waiting for its response. */
interface Pending {
  /** Request id the response will carry. */
  readonly id: number;
  /** How many values the response will hold — one per request in the batch. */
  readonly count: number;
  /** Resolves the caller's promise with the parsed values. */
  readonly resolve: (values: CallValue[]) => void;
  /** Rejects the caller's promise. */
  readonly reject: (error: unknown) => void;
  /** Timeout handle, absent when timeouts are disabled. */
  timer?: ReturnType<typeof setTimeout>;
}

/** A caller parked inside {@link MindConnectClient.waitForSignal}. */
interface SignalWaiter {
  /** Resolves with the next signal to arrive. */
  readonly resolve: (signal: StepSignal) => void;
  /** Rejects when the connection closes first. */
  readonly reject: (error: unknown) => void;
}

const ENCODER = new TextEncoder();

/** Longest plausible signal (`\x06` + `post` + a long version string). */
const MAX_SIGNAL_LENGTH = 24;

/**
 * One TCP connection to the game: framing, request/response correlation and
 * step signals.
 *
 * @remarks
 * {@link SSRPGInterface} owns one of these and exposes it as
 * {@link SSRPGInterface.client}. Reach for it directly only when you want the
 * protocol without the caching and stepping on top.
 *
 * Responses are matched to requests by id, so a stale or out-of-order reply
 * cannot desynchronise the stream. Because responses are not
 * length-delimited, the value count of the matching request is what tells the
 * parser where a frame ends.
 *
 * @example
 * ```ts
 * const client = new MindConnectClient({ port: 64649 });
 * await client.connect();
 * const [name] = await client.sendAndReceive([["foe.name"]]);
 * client.close();
 * ```
 */
export class MindConnectClient {
  /** Host this client connects to. */
  readonly hostname: string;

  /** TCP port this client connects to. */
  readonly port: number;

  readonly #connectTimeoutMs: number;
  readonly #requestTimeoutMs: number;

  #socket: Socket<undefined> | null = null;
  #decoder = new TextDecoder("utf-8");
  #buffer = "";
  #requestId = 0;

  readonly #pending = new Map<number, Pending>();
  readonly #signals: StepSignal[] = [];
  #signalWaiter: SignalWaiter | null = null;

  readonly #writeQueue: Uint8Array[] = [];
  #closeError: MindConnectError | null = null;

  /**
   * @param options - Connection settings; see {@link ClientOptions} for the
   * defaults.
   */
  constructor(options: ClientOptions = {}) {
    this.hostname = options.hostname ?? "127.0.0.1";
    this.port = options.port ?? 64649;
    this.#connectTimeoutMs = options.connectTimeoutMs ?? 10_000;
    this.#requestTimeoutMs = options.requestTimeoutMs ?? 10_000;
  }

  /**
   * Whether the socket is open and usable.
   *
   * @remarks
   * Turns `false` as soon as the connection closes for any reason, including a
   * protocol error.
   */
  get connected(): boolean {
    return this.#socket !== null && this.#closeError === null;
  }

  /**
   * Opens the TCP connection to the game.
   *
   * @remarks
   * Reconnecting after a close is allowed; buffered data and the failure state
   * are reset.
   *
   * @returns A promise that resolves once the socket is open.
   * @throws {@link MindConnectError} when a connection is already open.
   * @throws {@link ConnectFailedError} when the game refuses the connection or
   * the connect timeout elapses.
   */
  async connect(): Promise<void> {
    if (this.#socket) throw new MindConnectError("Already connected.");
    this.#closeError = null;
    this.#buffer = "";
    this.#decoder = new TextDecoder("utf-8");

    const connecting = Bun.connect<undefined>({
      hostname: this.hostname,
      port: this.port,
      socket: {
        data: (_socket, chunk) => this.#onData(chunk),
        drain: () => this.#flush(),
        close: () => this.#onClosed(new ConnectionClosedError("Connection closed by the game.")),
        error: (_socket, error) =>
          this.#onClosed(new ConnectionClosedError("Socket error.", { cause: error })),
        connectError: (_socket, error) => {
          // Surfaced through the rejected `Bun.connect` promise as well.
          this.#closeError = new ConnectFailedError(
            `Failed to connect to ${this.hostname}:${this.port}.`,
            { cause: error },
          );
        },
      },
    });

    let socket: Socket<undefined>;
    try {
      socket = await this.#withConnectTimeout(connecting);
    } catch (error) {
      if (error instanceof MindConnectError) throw error;
      throw new ConnectFailedError(`Failed to connect to ${this.hostname}:${this.port}.`, {
        cause: error,
      });
    }

    this.#socket = socket;
    this.#closeError = null;
  }

  /**
   * Closes the connection and fails everything still in flight.
   *
   * @remarks
   * Every pending request and any parked {@link MindConnectClient.waitForSignal}
   * rejects with {@link ConnectionClosedError}. Safe to call more than once.
   */
  close(): void {
    const socket = this.#socket;
    this.#onClosed(new ConnectionClosedError("Connection closed by the client."));
    socket?.end();
  }

  /**
   * Sends a request batch and waits for its response.
   *
   * @param requests - The batch to send. An empty batch resolves immediately
   * without touching the socket.
   * @returns One value per request, in the order the requests were given.
   * @throws {@link ConnectionClosedError} when the connection is not open, or
   * closes before the response arrives.
   * @throws {@link RequestTimeoutError} when the response does not arrive
   * within {@link ClientOptions.requestTimeoutMs}.
   * @throws {@link ProtocolError} when the request batch is malformed.
   */
  sendAndReceive(requests: readonly Request[]): Promise<CallValue[]> {
    if (requests.length === 0) return Promise.resolve([]);

    const socket = this.#requireSocket();
    const id = this.#nextRequestId();
    const packet = buildPacket(id, requests);

    return new Promise<CallValue[]>((resolve, reject) => {
      const pending: Pending = { id, count: requests.length, resolve, reject };
      this.#pending.set(id, pending);

      if (this.#requestTimeoutMs > 0) {
        pending.timer = setTimeout(() => {
          this.#pending.delete(id);
          reject(
            new RequestTimeoutError(
              `Request ${id} timed out after ${this.#requestTimeoutMs} ms.`,
            ),
          );
        }, this.#requestTimeoutMs);
        pending.timer.unref?.();
      }

      try {
        this.#write(socket, packet);
      } catch (error) {
        this.#settle(id)?.reject(error);
      }
    });
  }

  /**
   * Sends a request batch without waiting for the response.
   *
   * @remarks
   * Nothing correlates the reply, so the response frame cannot be parsed and
   * will surface as a {@link ProtocolError}. Use
   * {@link MindConnectClient.sendAndReceive} unless you are implementing your
   * own correlation on top.
   *
   * @param requests - The batch to send.
   * @returns The request id the batch was tagged with.
   * @throws {@link ConnectionClosedError} when the connection is not open.
   */
  sendRequest(requests: readonly Request[]): number {
    const socket = this.#requireSocket();
    const id = this.#nextRequestId();
    this.#write(socket, buildPacket(id, requests));
    return id;
  }

  /**
   * Waits for the next step signal from the game.
   *
   * @remarks
   * Signals that arrive before this is called are buffered, so no frame is
   * missed while your step callback is running. There is no timeout: a paused
   * game simply produces no frames.
   *
   * @returns The next signal, or a buffered one if the game is ahead.
   * @throws {@link ConnectionClosedError} when the connection is not open, or
   * closes while waiting.
   * @throws {@link MindConnectError} when another caller is already waiting.
   */
  waitForSignal(): Promise<StepSignal> {
    const buffered = this.#signals.shift();
    if (buffered) return Promise.resolve(buffered);
    if (this.#closeError) return Promise.reject(this.#closeError);
    if (!this.#socket) return Promise.reject(new ConnectionClosedError("Not connected."));
    if (this.#signalWaiter) {
      return Promise.reject(new MindConnectError("Already waiting for a step signal."));
    }

    return new Promise<StepSignal>((resolve, reject) => {
      this.#signalWaiter = { resolve, reject };
    });
  }

  /**
   * Tells the game that our step is done and it may resume.
   *
   * @remarks
   * Failures are swallowed: a closed connection is reported through the
   * pending request or signal waiter instead.
   */
  sendEof(): void {
    if (!this.#socket || this.#closeError) return;
    try {
      this.#write(this.#socket, EOF);
    } catch {
      // The game is gone; the close handler already reported it.
    }
  }

  // --- internals ---------------------------------------------------------

  /**
   * Races a pending connection against the connect timeout.
   *
   * @param connecting - The in-flight `Bun.connect` promise.
   * @returns The socket, once open.
   * @throws {@link ConnectFailedError} when the timeout elapses first.
   */
  async #withConnectTimeout(connecting: Promise<Socket<undefined>>): Promise<Socket<undefined>> {
    if (this.#connectTimeoutMs <= 0) return connecting;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new ConnectFailedError(
              `Timed out connecting to ${this.hostname}:${this.port} after ${this.#connectTimeoutMs} ms.`,
            ),
          ),
        this.#connectTimeoutMs,
      );
      timer.unref?.();
    });

    try {
      return await Promise.race([connecting, timeout]);
    } catch (error) {
      // Do not leak a socket that shows up after we gave up on it.
      void connecting.then(
        (socket) => socket.end(),
        () => {},
      );
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Returns the socket, or explains why there is none.
   *
   * @returns The open socket.
   * @throws {@link ConnectionClosedError} when the connection is not usable.
   */
  #requireSocket(): Socket<undefined> {
    if (this.#closeError) throw this.#closeError;
    if (!this.#socket) throw new ConnectionClosedError("Not connected.");
    return this.#socket;
  }

  /**
   * Allocates the next request id, wrapping at {@link MAX_REQUEST_ID}.
   *
   * @returns The id to tag the next request with.
   */
  #nextRequestId(): number {
    this.#requestId = (this.#requestId + 1) % MAX_REQUEST_ID;
    return this.#requestId;
  }

  /**
   * Writes a payload, queueing whatever the socket could not take.
   *
   * @param socket - The socket to write to.
   * @param payload - Text to encode as UTF-8 and send.
   */
  #write(socket: Socket<undefined>, payload: string): void {
    const bytes = ENCODER.encode(payload);
    if (this.#writeQueue.length > 0) {
      this.#writeQueue.push(bytes);
      return;
    }
    const written = socket.write(bytes);
    if (written < bytes.byteLength) this.#writeQueue.push(bytes.subarray(written));
  }

  /** Drains the backpressure queue once the socket is writable again. */
  #flush(): void {
    const socket = this.#socket;
    if (!socket) return;
    while (this.#writeQueue.length > 0) {
      const head = this.#writeQueue[0]!;
      const written = socket.write(head);
      if (written < head.byteLength) {
        this.#writeQueue[0] = head.subarray(written);
        return;
      }
      this.#writeQueue.shift();
    }
  }

  /**
   * Feeds a socket chunk into the frame parser.
   *
   * @remarks
   * Decoding is incremental, so a multi-byte character split across two
   * chunks is reassembled rather than corrupted.
   *
   * @param chunk - Bytes as they arrived from the socket.
   */
  #onData(chunk: Uint8Array): void {
    this.#buffer += this.#decoder.decode(chunk, { stream: true });
    try {
      this.#drain();
    } catch (error) {
      this.#onClosed(
        error instanceof MindConnectError
          ? error
          : new ProtocolError("Failed to read from the game.", { cause: error }),
      );
      this.#socket?.end();
    }
  }

  /**
   * Consumes as many complete frames from the buffer as possible.
   *
   * @throws {@link ProtocolError} when data arrives that cannot belong to any
   * frame.
   */
  #drain(): void {
    for (;;) {
      if (this.#buffer.length === 0) return;

      if (this.#buffer.startsWith(SIGNAL)) {
        if (!this.#takeSignal()) return;
        continue;
      }

      if (this.#pending.size > 0) {
        if (!this.#takeResponse()) return;
        continue;
      }

      throw new ProtocolError(
        `Unexpected data from the game while no request was in flight: ${JSON.stringify(
          this.#buffer.slice(0, 50),
        )}`,
      );
    }
  }

  /**
   * Frames one step signal, if the buffer holds a complete one.
   *
   * @returns Whether a signal was consumed.
   * @throws {@link ProtocolError} when the buffer starts with something that
   * cannot become a valid signal.
   */
  #takeSignal(): boolean {
    const parsed = parseSignal(this.#buffer);
    if (!parsed) {
      // Either still incomplete, or not a signal we understand at all.
      if (this.#buffer.length > MAX_SIGNAL_LENGTH) {
        throw new ProtocolError(
          `Malformed step signal: ${JSON.stringify(this.#buffer.slice(0, MAX_SIGNAL_LENGTH))}`,
        );
      }
      return false;
    }

    this.#buffer = this.#buffer.slice(parsed.consumed);

    const waiter = this.#signalWaiter;
    if (waiter) {
      this.#signalWaiter = null;
      waiter.resolve(parsed.signal);
    } else {
      this.#signals.push(parsed.signal);
    }
    return true;
  }

  /**
   * Frames one response, if the buffer holds a complete one.
   *
   * @remarks
   * Responses are not length-delimited, so the value count of the matching
   * request tells us where the frame ends. The final value runs to the next
   * control byte or, failing that, to the end of the buffer.
   *
   * @returns Whether a response was consumed.
   * @throws {@link ProtocolError} when the frame carries no usable request id.
   */
  #takeResponse(): boolean {
    const firstSeparator = this.#buffer.indexOf(US);
    if (firstSeparator === -1) return false;

    const rawId = this.#buffer.slice(0, firstSeparator);
    const id = Number(rawId);
    if (!Number.isInteger(id)) {
      throw new ProtocolError(`Expected a request id, got ${JSON.stringify(rawId)}.`);
    }

    const pending = this.#pending.get(id);
    if (!pending) {
      throw new ProtocolError(`Received a response for unknown request id ${id}.`);
    }

    const values: string[] = [];
    let cursor = firstSeparator + 1;
    let frameEnd = -1;

    while (values.length < pending.count) {
      const separator = this.#buffer.indexOf(US, cursor);
      if (separator !== -1) {
        values.push(this.#buffer.slice(cursor, separator));
        cursor = separator + 1;
        continue;
      }

      // No separator left: this can only be the last value of the frame.
      if (values.length !== pending.count - 1) return false;

      const terminator = this.#indexOfControl(cursor);
      if (terminator === -1) {
        values.push(this.#buffer.slice(cursor));
        frameEnd = this.#buffer.length;
      } else {
        values.push(this.#buffer.slice(cursor, terminator));
        frameEnd = terminator;
      }
      break;
    }

    this.#buffer = this.#buffer.slice(frameEnd === -1 ? cursor : frameEnd);
    this.#settle(id)?.resolve(values.map(autoCast));
    return true;
  }

  /**
   * Finds the next frame-terminating control byte.
   *
   * @param from - Index to start searching at.
   * @returns Index of the nearest {@link SIGNAL} or {@link EOF}, or `-1`.
   */
  #indexOfControl(from: number): number {
    const signal = this.#buffer.indexOf(SIGNAL, from);
    const eof = this.#buffer.indexOf(EOF, from);
    if (signal === -1) return eof;
    if (eof === -1) return signal;
    return Math.min(signal, eof);
  }

  /**
   * Removes a pending request and cancels its timeout.
   *
   * @param id - Request id to settle.
   * @returns The pending record, or `undefined` when it was already settled.
   */
  #settle(id: number): Pending | undefined {
    const pending = this.#pending.get(id);
    if (!pending) return undefined;
    this.#pending.delete(id);
    if (pending.timer) clearTimeout(pending.timer);
    return pending;
  }

  /**
   * Marks the connection dead and fails everything waiting on it.
   *
   * @remarks
   * Only the first call takes effect, so the original cause is the one
   * reported.
   *
   * @param error - Why the connection ended.
   */
  #onClosed(error: MindConnectError): void {
    if (this.#closeError) return;
    this.#closeError = error;
    this.#socket = null;
    this.#writeQueue.length = 0;

    for (const id of [...this.#pending.keys()]) {
      this.#settle(id)?.reject(error);
    }

    const waiter = this.#signalWaiter;
    if (waiter) {
      this.#signalWaiter = null;
      waiter.reject(error);
    }
  }
}
