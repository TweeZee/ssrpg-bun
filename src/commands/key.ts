import { callable, namespace, type CallHost } from "./base";

/**
 * `key` — key bindings.
 *
 * @experimental The Python reference implementation never enabled this class;
 * the game may not expose it over MindConnect yet.
 */
export interface Key {
  (): Promise<string | null>;
  Bind(action: string, key1: string, key2?: string): Promise<void>;
  GetActKey(action: string): Promise<string | null>;
  GetActKey1(action: string): Promise<string | null>;
  GetActKey2(action: string): Promise<string | null>;
  GetActLabel(action: string): Promise<string | null>;
  ResetBinds(): Promise<void>;
}

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
