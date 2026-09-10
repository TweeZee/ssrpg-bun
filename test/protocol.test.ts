import { describe, expect, test } from "bun:test";
import {
  asBool,
  asInt,
  asStr,
  autoCast,
  buildPacket,
  parseSignal,
  US,
} from "../src/protocol";
import { ProtocolError } from "../src/errors";

const wire = (...parts: string[]): string => parts.join(US);

describe("buildPacket", () => {
  test("tags integer and string arguments", () => {
    expect(buildPacket(1, [["draw.GetSymbol", 10, 5]])).toBe(
      wire("1", "1", "2", "draw.GetSymbol", "i", "10", "i", "5"),
    );
    expect(buildPacket(2, [["item.GetCooldown", "skeleton_arm"]])).toBe(
      wire("2", "1", "1", "item.GetCooldown", "s", "skeleton_arm"),
    );
  });

  test("sends non-integer numbers as strings", () => {
    expect(buildPacket(3, [["foo", 1.5]])).toBe(wire("3", "1", "1", "foo", "s", "1.5"));
  });

  test("sends booleans as 0/1 integers", () => {
    expect(buildPacket(4, [["foo", true, false]])).toBe(
      wire("4", "1", "2", "foo", "i", "1", "i", "0"),
    );
  });

  test("sends queued commands untagged", () => {
    expect(buildPacket(5, [[">", "`1,2,hi"]])).toBe(wire("5", "1", "1", ">", "`1,2,hi"));
    expect(buildPacket(6, [["brew", "tar+wood"]])).toBe(wire("6", "1", "1", "brew", "tar+wood"));
  });

  test("batches several requests", () => {
    expect(
      buildPacket(7, [
        ["foe.name"],
        ["loc.id"],
        ["draw.GetSymbol", 0, 0],
      ]),
    ).toBe(wire("7", "3", "0", "foe.name", "0", "loc.id", "2", "draw.GetSymbol", "i", "0", "i", "0"));
  });

  test("rejects malformed requests", () => {
    // @ts-expect-error deliberately invalid
    expect(() => buildPacket(8, [[]])).toThrow(ProtocolError);
  });
});

describe("autoCast", () => {
  test("converts booleans, integers and strings", () => {
    expect(autoCast("True")).toBe(true);
    expect(autoCast("False")).toBe(false);
    expect(autoCast("42")).toBe(42);
    expect(autoCast("-7")).toBe(-7);
    expect(autoCast("007")).toBe(7);
    expect(autoCast("3.5")).toBe("3.5");
    expect(autoCast("Wound Licker")).toBe("Wound Licker");
    expect(autoCast("")).toBe("");
    expect(autoCast(null)).toBeNull();
  });

  test("keeps unsafe integers as strings", () => {
    const huge = "9".repeat(25);
    expect(autoCast(huge)).toBe(huge);
  });
});

describe("narrowing helpers", () => {
  test("asInt keeps only numbers", () => {
    expect(asInt(5)).toBe(5);
    expect(asInt("5")).toBeNull();
    expect(asInt(true)).toBeNull();
    expect(asInt(null)).toBeNull();
  });

  test("asBool is true only for true", () => {
    expect(asBool(true)).toBe(true);
    expect(asBool(false)).toBe(false);
    expect(asBool("True")).toBe(false);
    expect(asBool(null)).toBe(false);
  });

  test("asStr stringifies everything but null", () => {
    expect(asStr("a")).toBe("a");
    expect(asStr(3)).toBe("3");
    expect(asStr(true)).toBe("true");
    expect(asStr(null)).toBeNull();
  });
});

describe("parseSignal", () => {
  test("reads sync contexts", () => {
    expect(parseSignal("\x06pre0.3")).toEqual({
      signal: { context: "pre", version: "0.3" },
      consumed: 7,
    });
    expect(parseSignal("\x06post0.3")).toEqual({
      signal: { context: "post", version: "0.3" },
      consumed: 8,
    });
  });

  test("treats a context-less signal as exclusive", () => {
    expect(parseSignal("\x060.3")).toEqual({
      signal: { context: "exclusive", version: "0.3" },
      consumed: 4,
    });
  });

  test("returns null for incomplete input", () => {
    expect(parseSignal("\x06pr")).toBeNull();
    expect(parseSignal("\x06pre0.")).toBeNull();
    expect(parseSignal("12\x1fx")).toBeNull();
  });
});
