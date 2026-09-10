/**
 * A minimal in-process stand-in for the game's MindConnect server, used to
 * exercise the client without Stone Story RPG running.
 */
import type { Socket, TCPSocketListener } from "bun";
import { EOF, PROTOCOL_VERSION, QUEUE_COMMANDS, SIGNAL, US } from "../src/protocol";

export interface ParsedRequest {
  name: string;
  args: string[];
}

export interface ReceivedBatch {
  id: number;
  requests: ParsedRequest[];
}

export interface MockServerOptions {
  /** Values returned per requested name. Functions get the parsed args. */
  values?: Record<string, string | ((args: string[]) => string)>;
  /** Fallback for names missing from `values`. */
  fallback?: string;
  /** Split every response into this many chunks to exercise the framing. */
  chunks?: number;
  /** Protocol version to report in step signals. */
  version?: string;
}

export class MockServer {
  readonly batches: ReceivedBatch[] = [];
  readonly eofs: number[] = [];

  #listener: TCPSocketListener<undefined> | null = null;
  #socket: Socket<undefined> | null = null;
  #buffer = "";
  #connected!: Promise<void>;
  #onConnected!: () => void;
  readonly #options: MockServerOptions;

  constructor(options: MockServerOptions = {}) {
    this.#options = options;
  }

  get port(): number {
    if (!this.#listener) throw new Error("Server is not listening.");
    return this.#listener.port;
  }

  /** Number of individual requests received across all batches. */
  get requestCount(): number {
    return this.batches.reduce((total, batch) => total + batch.requests.length, 0);
  }

  listen(): this {
    this.#connected = new Promise<void>((resolve) => {
      this.#onConnected = resolve;
    });
    this.#listener = Bun.listen<undefined>({
      hostname: "127.0.0.1",
      port: 0,
      socket: {
        open: (socket) => {
          this.#socket = socket;
          this.#onConnected();
        },
        data: (_socket, chunk) => this.#onData(chunk),
        close: () => {
          this.#socket = null;
        },
        error: () => {},
      },
    });
    return this;
  }

  /** Resolves once a client has connected. */
  waitForConnection(): Promise<void> {
    return this.#connected;
  }

  stop(): void {
    this.#socket?.end();
    this.#listener?.stop(true);
    this.#listener = null;
  }

  /** Drops the connection without a graceful shutdown. */
  hangUp(): void {
    this.#socket?.end();
    this.#socket = null;
  }

  /** Sends a step signal to the client. */
  sendSignal(context: "pre" | "post" | "" = "pre", version = this.#options.version ?? PROTOCOL_VERSION): void {
    this.#write(`${SIGNAL}${context}${version}`);
  }

  /** Sends arbitrary bytes, for protocol-error tests. */
  sendRaw(payload: string): void {
    this.#write(payload);
  }

  #onData(chunk: Uint8Array): void {
    this.#buffer += new TextDecoder().decode(chunk);

    for (;;) {
      if (this.#buffer.startsWith(EOF)) {
        this.#buffer = this.#buffer.slice(EOF.length);
        this.eofs.push(this.batches.length);
        continue;
      }
      const batch = this.#takeBatch();
      if (!batch) return;
      this.batches.push(batch);
      this.#respond(batch);
    }
  }

  /** Requests are fully self-describing, so one batch can always be framed. */
  #takeBatch(): ReceivedBatch | null {
    // An EOF marker may be glued to the end of a batch; keep it for the caller.
    const eofIndex = this.#buffer.indexOf(EOF);
    const region = eofIndex === -1 ? this.#buffer : this.#buffer.slice(0, eofIndex);
    const tail = eofIndex === -1 ? "" : this.#buffer.slice(eofIndex);
    if (region.length === 0) return null;

    const fields = region.split(US);
    if (fields.length < 2) return null;

    const id = Number(fields[0]);
    const count = Number(fields[1]);
    if (!Number.isInteger(id) || !Number.isInteger(count)) {
      throw new Error(`Malformed request header: ${JSON.stringify(this.#buffer.slice(0, 40))}`);
    }

    const requests: ParsedRequest[] = [];
    let cursor = 2;

    for (let i = 0; i < count; i++) {
      if (cursor >= fields.length) return null;
      const argc = Number(fields[cursor++]);
      const name = fields[cursor++];
      if (name === undefined) return null;

      const args: string[] = [];
      const isCommand = QUEUE_COMMANDS.has(name);
      for (let a = 0; a < argc; a++) {
        if (isCommand) {
          const value = fields[cursor++];
          if (value === undefined) return null;
          args.push(value);
        } else {
          const value = fields[cursor + 1];
          if (value === undefined) return null;
          cursor += 2;
          args.push(value);
        }
      }
      requests.push({ name, args });
    }

    this.#buffer = fields.slice(cursor).join(US) + tail;
    return { id, requests };
  }

  #respond(batch: ReceivedBatch): void {
    const values = batch.requests.map(({ name, args }) => {
      const configured = this.#options.values?.[name];
      if (typeof configured === "function") return configured(args);
      if (configured !== undefined) return configured;
      return this.#options.fallback ?? "";
    });

    const payload = [String(batch.id), ...values].join(US);
    const chunks = this.#options.chunks ?? 1;
    if (chunks <= 1) {
      this.#write(payload);
      return;
    }

    const size = Math.max(1, Math.ceil(payload.length / chunks));
    let offset = 0;
    const writeNext = (): void => {
      if (offset >= payload.length) return;
      this.#write(payload.slice(offset, offset + size));
      offset += size;
      setTimeout(writeNext, 1);
    };
    writeNext();
  }

  #write(payload: string): void {
    this.#socket?.write(new TextEncoder().encode(payload));
  }
}
