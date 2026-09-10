import { namespace, type CallHost } from "./base";

/** `screen` — the visible viewport and world/screen coordinate conversion. */
export interface Screen {
  i(): Promise<number | null>;
  x(): Promise<number | null>;
  w(): Promise<number | null>;
  h(): Promise<number | null>;
  FromWorldX(value: number): Promise<number | null>;
  FromWorldZ(value: number): Promise<number | null>;
  ToWorldX(value: number): Promise<number | null>;
  ToWorldZ(value: number): Promise<number | null>;
  Next(): Promise<void>;
  Previous(): Promise<void>;
  ResetOffset(): Promise<void>;
}

export function createScreen(host: CallHost): Screen {
  const ns = namespace(host, "screen");
  return {
    i: () => ns.int("i"),
    x: () => ns.int("x"),
    w: () => ns.int("w"),
    h: () => ns.int("h"),
    FromWorldX: (value) => ns.int("FromWorldX", value),
    FromWorldZ: (value) => ns.int("FromWorldZ", value),
    ToWorldX: (value) => ns.int("ToWorldX", value),
    ToWorldZ: (value) => ns.int("ToWorldZ", value),
    Next: () => ns.invoke("Next"),
    Previous: () => ns.invoke("Previous"),
    ResetOffset: () => ns.invoke("ResetOffset"),
  };
}
