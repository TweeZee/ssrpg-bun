import { afterEach, describe, expect, test } from "bun:test";
import { MockServer } from "./mock-server";
import { SSRPGInterface } from "../src/interface";
import { ConnectionClosedError, ModeError } from "../src/errors";
import type { Mode, StepContext } from "../src/types";

const cleanup: Array<() => void> = [];

afterEach(() => {
  while (cleanup.length > 0) cleanup.pop()!();
});

async function harness(
  server: MockServer,
  mode: Mode = "sync",
): Promise<SSRPGInterface> {
  server.listen();
  const ssrpg = new SSRPGInterface({ mode, port: server.port, requestTimeoutMs: 2_000 });
  cleanup.push(() => {
    ssrpg.disconnect();
    server.stop();
  });
  await ssrpg.connect();
  await server.waitForConnection();
  return ssrpg;
}

describe("step", () => {
  test("reads state, flushes commands and hands control back", async () => {
    const server = new MockServer({
      values: {
        "loc.begin": "True",
        "foe.name": "Wound Licker",
        "foe.distance": "5",
        time: "128",
      },
    });
    const ssrpg = await harness(server);

    const contexts: StepContext[] = [];
    server.sendSignal("pre");

    await ssrpg.step(async (context) => {
      contexts.push(context);
      expect(await ssrpg.loc.begin()).toBe(true);
      expect(await ssrpg.foe.name()).toBe("Wound Licker");
      expect(await ssrpg.foe.distance()).toBe(5);
      expect(await ssrpg.time()).toBe(128);

      ssrpg.print("hello bun", { x: 1, y: 2 });
      ssrpg.brew("tar", "wood");
      ssrpg.loc.Pause();
    });

    expect(contexts).toEqual(["pre"]);

    // Commands are sent as one batch after the callback returns.
    expect(server.batches.at(-1)!.requests).toEqual([
      { name: ">", args: ["`1,2,hello bun"] },
      { name: "brew", args: ["tar+wood"] },
      { name: "loc.Pause", args: [] },
    ]);

    await Bun.sleep(25);
    expect(server.eofs.length).toBe(1);
  });

  test("passes the post context through", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server);

    server.sendSignal("post");
    const context = await ssrpg.step(() => {});
    expect(context).toBe("post");
  });

  test("reports an exclusive-mode signal", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server, "exclusive");

    server.sendSignal("");
    expect(await ssrpg.step(() => {})).toBe("exclusive");
  });

  test("still releases the game when the callback throws", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server);

    server.sendSignal("pre");
    await expect(
      ssrpg.step(() => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    await Bun.sleep(25);
    expect(server.eofs.length).toBe(1);
  });

  test("is unavailable in async mode", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server, "async");
    await expect(ssrpg.step(() => {})).rejects.toThrow(ModeError);
  });
});

describe("caching", () => {
  test("collapses repeated reads within one step", async () => {
    const server = new MockServer({ values: { "foe.hp": "40" } });
    const ssrpg = await harness(server);

    server.sendSignal("pre");
    await ssrpg.step(async () => {
      const [a, b, c] = await Promise.all([ssrpg.foe.hp(), ssrpg.foe.hp(), ssrpg.foe.hp()]);
      expect([a, b, c]).toEqual([40, 40, 40]);
    });

    expect(server.requestCount).toBe(1);
  });

  test("starts each step with a clean cache", async () => {
    const server = new MockServer({ values: { "foe.hp": "40" } });
    const ssrpg = await harness(server);

    for (const _ of [0, 1]) {
      server.sendSignal("pre");
      await ssrpg.step(async () => {
        await ssrpg.foe.hp();
      });
    }

    expect(server.requestCount).toBe(2);
  });

  test("never caches var or storage reads", async () => {
    const server = new MockServer({ values: { "var.get": "heal", "var.has": "True" } });
    const ssrpg = await harness(server);

    server.sendSignal("pre");
    await ssrpg.step(async () => {
      expect(await ssrpg.var.get("mode")).toBe("heal");
      expect(await ssrpg.var.get("mode")).toBe("heal");
      expect(await ssrpg.var.has("mode")).toBe(true);
      await ssrpg.var.set("mode", "attack");
    });

    expect(server.batches.flatMap((batch) => batch.requests)).toEqual([
      { name: "var.get", args: ["mode"] },
      { name: "var.get", args: ["mode"] },
      { name: "var.has", args: ["mode"] },
      { name: "var.set", args: ["mode", "attack"] },
    ]);
  });
});

describe("multiCall and getScreen", () => {
  test("returns one value per request", async () => {
    const server = new MockServer({
      values: { "foe.name": "Wound Licker", "loc.id": "caustic_caves", "draw.GetSymbol": "-" },
    });
    const ssrpg = await harness(server);

    const results = await ssrpg.multiCall([["foe.name"], ["loc.id"], ["draw.GetSymbol", 10, 5]]);
    expect(results).toEqual(["Wound Licker", "caustic_caves", "-"]);
    expect(server.batches).toHaveLength(1);
  });

  test("lays the screen out row by row", async () => {
    const server = new MockServer({
      values: { "draw.GetSymbol": ([x, y]) => (x === y ? "#" : ".") },
    });
    const ssrpg = await harness(server);

    expect(await ssrpg.getScreen(0, 0, 3, 3)).toBe("#..\n.#.\n..#");
    expect(server.requestCount).toBe(9);
  });

  test("survives responses split across chunks", async () => {
    const server = new MockServer({
      chunks: 7,
      values: { "draw.GetSymbol": ([x]) => String(Number(x) % 10) },
    });
    const ssrpg = await harness(server);

    expect(await ssrpg.getScreen(0, 0, 4, 2)).toBe("0123\n0123");
  });
});

describe("connection lifecycle", () => {
  test("fails a pending step when the game disappears", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server);

    const stepping = ssrpg.step(() => {});
    await Bun.sleep(10);
    server.hangUp();

    await expect(stepping).rejects.toThrow(ConnectionClosedError);
    expect(ssrpg.connected).toBe(false);
  });

  test("run() loops until the connection drops", async () => {
    const server = new MockServer({ values: { hp: "100" } });
    const ssrpg = await harness(server);

    let steps = 0;
    const running = ssrpg.run(async () => {
      steps++;
      await ssrpg.hp();
    });

    for (const _ of [0, 1, 2]) {
      server.sendSignal("pre");
      await Bun.sleep(10);
    }
    server.hangUp();

    await running;
    expect(steps).toBe(3);
  });

  test("run() stops on abort", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server);

    const controller = new AbortController();
    const running = ssrpg.run(() => {}, { signal: controller.signal });

    await Bun.sleep(10);
    controller.abort();

    await running;
    expect(ssrpg.connected).toBe(false);
  });

  test("refuses an unknown mode", () => {
    expect(() => new SSRPGInterface({ mode: "turbo" as Mode })).toThrow(ModeError);
  });
});

describe("print options", () => {
  test("encode positioning prefixes", async () => {
    const server = new MockServer();
    const ssrpg = await harness(server);

    server.sendSignal("pre");
    await ssrpg.step(() => {
      ssrpg.print("plain");
      ssrpg.print("at", { x: 3, y: 4 });
      ssrpg.print("red", { x: 3, y: 4, color: "r" });
      ssrpg.print("onplayer", { x: 1, y: 1, player: true });
      ssrpg.print("onhead", { x: 1, y: 1, head: true });
      ssrpg.print("onfoe", { x: 1, y: 1, foe: true });
      ssrpg.print("centred", { x: 1, y: 1, center: true });
      ssrpg.print("face", { x: 1, y: 1, face: true });
      ssrpg.print(["a", 1, true]);
    });

    expect(server.batches.at(-1)!.requests.map((request) => request.args[0])).toEqual([
      "plain",
      "`3,4,at",
      "`3,4,r,red",
      "o1,1,onplayer",
      "h1,1,onhead",
      "f1,1,onfoe",
      "c1,1,centred",
      "(face",
      "a1true",
    ]);
  });
});
