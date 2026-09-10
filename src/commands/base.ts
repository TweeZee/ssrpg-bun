/**
 * Shared plumbing for the StoneScript namespace wrappers.
 */
import { asBool, asInt, asStr } from "../protocol";
import type { CallValue, Scalar } from "../types";

/** The subset of {@link SSRPGInterface} the namespace wrappers depend on. */
export interface CallHost {
  /** Reads a variable or calls a function, cached for the current step. */
  call(command: string, ...args: Scalar[]): Promise<CallValue>;
  /** Same as {@link CallHost.call} but never cached. */
  callUncached(command: string, ...args: Scalar[]): Promise<CallValue>;
  /** Queues a request to be sent at the end of the current step. */
  queue(command: string, ...args: Scalar[]): void;
}

/** Typed accessors bound to one StoneScript class, e.g. `foe` or `item.left`. */
export interface Namespace {
  readonly className: string;
  /** Fully qualified name of a member, e.g. `foe.hp`. */
  member(name: string): string;
  /** Cached read, auto-converted. */
  raw(name: string, ...args: Scalar[]): Promise<CallValue>;
  /** Cached read as an integer (`null` when the value is not an integer). */
  int(name: string, ...args: Scalar[]): Promise<number | null>;
  /** Cached read as a boolean. */
  bool(name: string, ...args: Scalar[]): Promise<boolean>;
  /** Cached read as a string (`null` when there is no value). */
  str(name: string, ...args: Scalar[]): Promise<string | null>;
  /** Uncached read, for values that change within a step. */
  live(name: string, ...args: Scalar[]): Promise<CallValue>;
  /** Uncached call of a side-effecting function. */
  invoke(name: string, ...args: Scalar[]): Promise<void>;
  /** Queues a side-effecting call for the end of the step. */
  queue(name: string, ...args: Scalar[]): void;
}

/** Creates the accessors for one StoneScript class. */
export function namespace(host: CallHost, className: string): Namespace {
  const member = (name: string): string =>
    className && name ? `${className}.${name}` : className || name;

  return {
    className,
    member,
    raw: (name, ...args) => host.call(member(name), ...args),
    int: async (name, ...args) => asInt(await host.call(member(name), ...args)),
    bool: async (name, ...args) => asBool(await host.call(member(name), ...args)),
    str: async (name, ...args) => asStr(await host.call(member(name), ...args)),
    live: (name, ...args) => host.callUncached(member(name), ...args),
    invoke: async (name, ...args) => {
      await host.callUncached(member(name), ...args);
    },
    queue: (name, ...args) => host.queue(member(name), ...args),
  };
}

/**
 * Attaches members to a function so a namespace can be both called and
 * navigated, mirroring Python's `__call__`.
 *
 * Uses `defineProperty` rather than `Object.assign` because members such as
 * `name` and `length` shadow non-writable properties of the function itself.
 */
export function callable<F extends (...args: never[]) => unknown, M extends object>(
  fn: F,
  members: M,
): F & M {
  for (const [key, value] of Object.entries(members)) {
    Object.defineProperty(fn, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  return fn as F & M;
}
