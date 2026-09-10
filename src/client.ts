/**
 * Low-level MindConnect client: one TCP socket, request/response correlation
 * and step-signal framing.
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

export interface ClientOptions {
  /** Game host. Defaults to `127.0.0.1`. */
  hostname?: string;
  /** MindConnect port. Defaults to `64649`. */
  port?: number;
  /** How long to wait for the TCP connection. Defaults to 10 000 ms. */
  connectTimeoutMs?: number;
  /** How long to wait for a response. Defaults to 10 000 ms; `0` disables it. */
  requestTimeoutMs?: number;
}

interface Pending {
  readonly id: number;
  readonly count: number;
  readonly resolve: (values: CallValue[]) => void;
  readonly reject: (error: unknown) => void;
  timer?: ReturnType<typeof setTimeout>;
}

interface SignalWaiter {
  readonly resolve: (signal: StepSignal) => void;
  readonly reject: (error: unknown) => void;
}

const ENCODER = new TextEncoder();

/** Longest plausible signal (`\x06` + `post` + a long version string). */
const MAX_SIGNAL_LENGTH = 24;

export class MindConnectClient {
  readonly hostname: string;
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

  constructor(options: ClientOptions = {}) {
    this.hostname = options.hostname ?? "127.0.0.1";
    this.port = options.port ?? 64649;
    this.#connectTimeoutMs = options.connectTimeoutMs ?? 10_000;
    this.#requestTimeoutMs = options.requestTimeoutMs ?? 10_000;
  }

  get connected(): boolean {
    return this.#socket !== null && this.#closeError === null;
  }

  /** Opens the TCP connection to the game. */
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

  /** Closes the connection and fails everything still in flight. */
  close(): void {
    const socket = this.#socket;
    this.#onClosed(new ConnectionClosedError("Connection closed by the client."));
    socket?.end();
  }

  /** Sends a request batch and resolves with one value per request. */
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
   * Sends a request batch without waiting for the response and returns its id.
   * Only useful in `async` mode.
   */
  sendRequest(requests: readonly Request[]): number {
    const socket = this.#requireSocket();
    const id = this.#nextRequestId();
    this.#write(socket, buildPacket(id, requests));
    return id;
  }

  /** Waits for the next `pre`/`post`/`exclusive` step signal from the game. */
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

  /** Tells the game that our step is done and it may resume. */
  sendEof(): void {
    if (!this.#socket || this.#closeError) return;
    try {
      this.#write(this.#socket, EOF);
    } catch {
      // The game is gone; the close handler already reported it.
    }
  }

  // --- internals ---------------------------------------------------------

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

  #requireSocket(): Socket<undefined> {
    if (this.#closeError) throw this.#closeError;
    if (!this.#socket) throw new ConnectionClosedError("Not connected.");
    return this.#socket;
  }

  #nextRequestId(): number {
    this.#requestId = (this.#requestId + 1) % MAX_REQUEST_ID;
    return this.#requestId;
  }

  #write(socket: Socket<undefined>, payload: string): void {
    const bytes = ENCODER.encode(payload);
    if (this.#writeQueue.length > 0) {
      this.#writeQueue.push(bytes);
      return;
    }
    const written = socket.write(bytes);
    if (written < bytes.byteLength) this.#writeQueue.push(bytes.subarray(written));
  }

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

  /** Consumes as many complete frames from the buffer as possible. */
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
   * Responses are not length-delimited, so the value count of the matching
   * request tells us where the frame ends. The final value runs to the next
   * control byte or, failing that, to the end of the buffer.
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

  /** Index of the next frame-terminating control byte at or after `from`. */
  #indexOfControl(from: number): number {
    const signal = this.#buffer.indexOf(SIGNAL, from);
    const eof = this.#buffer.indexOf(EOF, from);
    if (signal === -1) return eof;
    if (eof === -1) return signal;
    return Math.min(signal, eof);
  }

  #settle(id: number): Pending | undefined {
    const pending = this.#pending.get(id);
    if (!pending) return undefined;
    this.#pending.delete(id);
    if (pending.timer) clearTimeout(pending.timer);
    return pending;
  }

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
