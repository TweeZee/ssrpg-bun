/**
 * Shared plumbing for the StoneScript namespace wrappers.
 *
 * @remarks
 * Every namespace in {@link SSRPGInterface} — `foe`, `item`, `loc` and the
 * rest — is a plain object built by a `create*` factory on top of
 * {@link namespace}. The factories take a {@link CallHost}, which in practice
 * is the {@link SSRPGInterface} itself.
 *
 * @packageDocumentation
 */
import { asBool, asInt, asStr } from "../protocol";
import type { CallValue, Scalar } from "../types";

/**
 * The subset of {@link SSRPGInterface} the namespace wrappers depend on.
 *
 * @remarks
 * Declared as an interface so namespaces can be built against a stub in tests
 * without a live connection.
 */
export interface CallHost {
  /**
   * Reads a variable or calls a function, memoised for the current step.
   *
   * @param command - Fully qualified StoneScript name, e.g. `foe.hp`.
   * @param args - Arguments to pass to the function.
   * @returns The converted result.
   */
  call(command: string, ...args: Scalar[]): Promise<CallValue>;

  /**
   * Reads a variable or calls a function, bypassing the cache.
   *
   * @param command - Fully qualified StoneScript name, e.g. `var.get`.
   * @param args - Arguments to pass to the function.
   * @returns The converted result.
   */
  callUncached(command: string, ...args: Scalar[]): Promise<CallValue>;

  /**
   * Queues a request to be sent when the current step ends.
   *
   * @param command - Fully qualified StoneScript name, e.g. `loc.Pause`.
   * @param args - Arguments to pass along.
   */
  queue(command: string, ...args: Scalar[]): void;
}

/**
 * Typed accessors bound to one StoneScript class, such as `foe` or
 * `item.left`.
 *
 * @remarks
 * The `int`, `bool` and `str` helpers all read through the per-step cache;
 * `live` and `invoke` deliberately do not, because they are used for values
 * the in-game script can change mid-step and for calls with side effects.
 */
export interface Namespace {
  /** The StoneScript class these accessors are bound to, e.g. `foe.buffs`. */
  readonly className: string;

  /**
   * Builds the fully qualified name of a member.
   *
   * @param name - Member name, or `""` for the class itself.
   * @returns For example `foe.hp`, or `foe` when `name` is empty.
   */
  member(name: string): string;

  /**
   * Cached read, converted by {@link autoCast}.
   *
   * @param name - Member name, or `""` for the class itself.
   * @param args - Arguments to pass to the function.
   * @returns The converted value.
   */
  raw(name: string, ...args: Scalar[]): Promise<CallValue>;

  /**
   * Cached read narrowed to an integer.
   *
   * @param name - Member name, or `""` for the class itself.
   * @param args - Arguments to pass to the function.
   * @returns The number, or `null` when the value is absent or not an integer.
   */
  int(name: string, ...args: Scalar[]): Promise<number | null>;

  /**
   * Cached read narrowed to a boolean.
   *
   * @param name - Member name, or `""` for the class itself.
   * @param args - Arguments to pass to the function.
   * @returns Whether the game returned `True`.
   */
  bool(name: string, ...args: Scalar[]): Promise<boolean>;

  /**
   * Cached read narrowed to a string.
   *
   * @param name - Member name, or `""` for the class itself.
   * @param args - Arguments to pass to the function.
   * @returns The value, or `null` when the game had none.
   */
  str(name: string, ...args: Scalar[]): Promise<string | null>;

  /**
   * Uncached read, for values that can change within a single step.
   *
   * @param name - Member name, or `""` for the class itself.
   * @param args - Arguments to pass to the function.
   * @returns The converted value.
   */
  live(name: string, ...args: Scalar[]): Promise<CallValue>;

  /**
   * Uncached call of a side-effecting function.
   *
   * @param name - Member name to invoke.
   * @param args - Arguments to pass to the function.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  invoke(name: string, ...args: Scalar[]): Promise<void>;

  /**
   * Queues a side-effecting call for the end of the step.
   *
   * @param name - Member name to invoke.
   * @param args - Arguments to pass to the function.
   */
  queue(name: string, ...args: Scalar[]): void;
}

/**
 * Creates the accessors for one StoneScript class.
 *
 * @param host - The interface the calls are routed through.
 * @param className - StoneScript class name, e.g. `foe` or `item.left`. Pass
 * `""` to address top-level variables.
 * @returns Accessors bound to `className`.
 *
 * @example
 * ```ts
 * const ns = namespace(ssrpg, "foe");
 * await ns.int("hp");           // reads foe.hp
 * await ns.str("");             // reads foe itself
 * ```
 */
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
 * @remarks
 * Uses `Object.defineProperty` rather than `Object.assign` because members such
 * as `name` and `length` shadow non-writable properties of the function
 * itself — assigning to them throws in strict mode.
 *
 * @typeParam F - The callable part, e.g. `() => Promise<string | null>`.
 * @typeParam M - The members to attach.
 * @param fn - The function to decorate. Mutated in place.
 * @param members - Properties to define on `fn`.
 * @returns `fn`, typed as both callable and carrying `members`.
 *
 * @example
 * ```ts
 * const foe = callable(() => ns.str(""), { hp: () => ns.int("hp") });
 * await foe();    // foe
 * await foe.hp(); // foe.hp
 * ```
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
