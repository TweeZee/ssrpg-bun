/**
 * The `key` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";

/**
 * `key` — key bindings.
 *
 * @remarks
 * Call the namespace itself to read the key currently pressed.
 *
 * @experimental The Python reference implementation left this class disabled,
 * so the game may not expose it over MindConnect yet. Expect
 * {@link ProtocolError | protocol errors} or empty values.
 */
export interface Key {
  /**
   * Reads `key`.
   *
   * @returns The key currently pressed, or `null` when none is.
   */
  (): Promise<string | null>;

  /**
   * Calls `key.Bind` — binds an action to one or two keys.
   *
   * @param action - Action id to bind.
   * @param key1 - Primary key.
   * @param key2 - Optional secondary key.
   * @returns A promise that settles once the game has acknowledged the call.
   */
  Bind(action: string, key1: string, key2?: string): Promise<void>;

  /**
   * Calls `key.GetActKey`.
   *
   * @param action - Action id to look up.
   * @returns The key bound to the action.
   */
  GetActKey(action: string): Promise<string | null>;

  /**
   * Calls `key.GetActKey1`.
   *
   * @param action - Action id to look up.
   * @returns The action's primary key.
   */
  GetActKey1(action: string): Promise<string | null>;

  /**
   * Calls `key.GetActKey2`.
   *
   * @param action - Action id to look up.
   * @returns The action's secondary key.
   */
  GetActKey2(action: string): Promise<string | null>;

  /**
   * Calls `key.GetActLabel`.
   *
   * @param action - Action id to look up.
   * @returns The action's human-readable label.
   */
  GetActLabel(action: string): Promise<string | null>;

  /**
   * Calls `key.ResetBinds` — restores the default key bindings.
   *
   * @returns A promise that settles once the game has acknowledged the call.
   */
  ResetBinds(): Promise<void>;
}

/**
 * Builds the {@link Key} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `key`.
 *
 * @experimental See {@link Key}.
 */
export function createKey(host: CallHost): Key {
  const ns = namespace(host, "key");
  return callable(() => ns.str(""), {
    Bind: (action: string, key1: string, key2?: string) =>
      key2 === undefined ? ns.invoke("Bind", action, key1) : ns.invoke("Bind", action, key1, key2),
    GetActKey: (action: string) => ns.str("GetActKey", action),
    GetActKey1: (action: string) => ns.str("GetActKey1", action),
    GetActKey2: (action: string) => ns.str("GetActKey2", action),
    GetActLabel: (action: string) => ns.str("GetActLabel", action),
    ResetBinds: () => ns.invoke("ResetBinds"),
  }) satisfies Key;
}
