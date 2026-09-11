# ssrpg-bun

A Bun/TypeScript interface for [Stone Story RPG](https://stonestoryrpg.com/) (v4.25.0 or above),
letting you drive the game from a TypeScript script over the MindConnect protocol.

This is a port of [SSRPGInterface](https://github.com/artificial-potato/SSRPGInterface)
(MindConnect protocol **v0.3**) by ArtificialPotato.

## Features

- **Typed high-level API** mirroring the in-game namespaces: `ssrpg.foe.hp()`, `ssrpg.item.CanActivate("skeleton_arm")`, `ssrpg.loc.begin()`.
- **Command queueing** — commands are collected during a step and flushed in a single batch when your callback returns.
- **Per-step caching** — repeated reads of the same value cost one round trip; concurrent reads share it.
- **Modes** — `sync` (run alongside an in-game Stonescript), `exclusive` (own the game logic) and `async`.
- **Streaming frame parser** — responses split across TCP reads are reassembled correctly.
- No runtime dependencies.

## Requirements

- [Bun](https://bun.sh) 1.2 or newer
- Stone Story RPG v4.25.0 or above, with the mindstone enabled

## Quick start

```bash
bun install
bun run examples/test.ts
```

1. Launch Stone Story RPG.
2. Enable the mindstone and make `//MindConnect: sync` (or `exclusive`) the **very first line** of your Stonescript.
3. Enter any location.
4. Run your script.

## Usage

```ts
import { SSRPGInterface, type StepContext } from "ssrpg-bun";

const ssrpg = new SSRPGInterface({ mode: "sync" });

let yPos = 0;

async function step(context: StepContext) {
  // In sync mode every game frame yields a 'pre' and a 'post' step.
  if (context !== "pre") return;

  if (await ssrpg.loc.begin()) {
    yPos = 0;
    ssrpg.brew("tar", "wood"); // queued, sent when the callback returns
  }

  yPos = (yPos + 1) % 30;
  ssrpg.print(`hello bun! ${new Date().toLocaleTimeString()}`, { x: 1, y: yPos });

  const foe = await ssrpg.foe();
  const distance = await ssrpg.foe.distance();

  if (foe?.includes("boss")) {
    ssrpg.equipR("sword");
    ssrpg.equipL("hammer");
    ssrpg.loc.Pause();
  } else {
    ssrpg.equip("arm");
    if (distance !== null && distance < 8 && (await ssrpg.item.CanActivate("skeleton_arm"))) {
      ssrpg.activate("R");
    }
  }
}

await ssrpg.connect();
await ssrpg.run(step); // returns when the game disconnects
```

`run()` is a convenience loop around `step()`. If you want to own the loop:

```ts
while (ssrpg.connected) {
  await ssrpg.step(step);
}
```

To stop cleanly on Ctrl+C, pass an `AbortSignal`:

```ts
const controller = new AbortController();
process.on("SIGINT", () => controller.abort());
await ssrpg.run(step, { signal: controller.signal });
```

## Constructor options

```ts
new SSRPGInterface({
  mode: "sync",              // 'sync' | 'exclusive' | 'async'  (default 'sync')
  hostname: "127.0.0.1",     // default
  port: 64649,               // default
  connectTimeoutMs: 10_000,  // 0 disables
  requestTimeoutMs: 10_000,  // 0 disables
  warnOnVersionMismatch: true,
});
```

## High-level API

### Queued commands

Available both on the interface and on `ssrpg.command`:

| Method | StoneScript |
| --- | --- |
| `ssrpg.print(text, options?)` | `>` |
| `ssrpg.play(...args)` | `play` |
| `ssrpg.equip(...items)` / `equipL` / `equipR` | `equip` / `equipL` / `equipR` |
| `ssrpg.loadout(index)` | `loadout` |
| `ssrpg.activate("R" \| "L")` | `activate` |
| `ssrpg.enable(...names)` / `ssrpg.disable(...names)` | `enable` / `disable` |
| `ssrpg.brew(...materials)` | `brew` |
| `ssrpg.loc.Leave()` / `ssrpg.loc.Pause()` | `loc.Leave` / `loc.Pause` |

`print` options: `x`, `y`, `color`, and the mutually exclusive anchors `face`, `player`, `head`, `foe`, `center`.
Pass an array as the first argument to concatenate several values.

Queued commands are synchronous — they only add to the queue. The queue is flushed
once, at the end of the step, and cleared at the start of the next one.

### Game-state namespaces

Every read is `async`. Names match StoneScript, so the in-game documentation applies:

- `ssrpg.loc()`, `ssrpg.loc.begin()`, `ssrpg.loc.isQuest()`, `ssrpg.loc.stars()`, …
- `ssrpg.foe()`, `ssrpg.foe.distance()`, `ssrpg.foe.hp()`, `ssrpg.foe.buffs.GetTime("burn")`, …
- `ssrpg.item.GetCooldown(name)`, `ssrpg.item.CanActivate(name?)`, `ssrpg.item.left()`, `ssrpg.item.right.gp()`, …
- `ssrpg.player`, `ssrpg.pos`, `ssrpg.res`, `ssrpg.screen`, `ssrpg.summon`, `ssrpg.harvest`,
  `ssrpg.pickup`, `ssrpg.input`, `ssrpg.encounter`, `ssrpg.event`, `ssrpg.ai`, `ssrpg.armor`,
  `ssrpg.buffs`, `ssrpg.debuffs`, `ssrpg.draw`
- Top-level variables: `ssrpg.time()`, `ssrpg.totaltime()`, `ssrpg.hp()`, `ssrpg.maxhp()`,
  `ssrpg.maxarmor()`, `ssrpg.face()`, `ssrpg.bighead()`, `ssrpg.totalgp()`

Integer accessors resolve to `number | null` (`null` when the game has no value),
boolean accessors to `boolean`, and name accessors to `string | null`.

`ssrpg.key`, `ssrpg.storage` and `ssrpg.te` are ported but marked `@experimental`:
the Python reference implementation never enabled them, so the game may not expose
them over MindConnect yet.

### Stonescript variables

```ts
await ssrpg.var.get("mode");           // read
await ssrpg.var.set("mode", "heal");   // write
await ssrpg.var.has("mode");           // exists?
```

These are never cached — the in-game script can change a variable between two reads
inside the same step.

## Low-level API

```ts
// One variable or function call. Cached for the rest of the step.
const foeName = await ssrpg.call("foe.name");

// The same call, bypassing the cache.
const live = await ssrpg.callUncached("foe.hp");

// Several calls in a single round trip.
const [name, id, symbol] = await ssrpg.multiCall([
  ["foe.name"],
  ["loc.id"],
  ["draw.GetSymbol", 10, 5],
]);
// -> ['Wound Licker', 'caustic_caves', '-']

// A block of the screen as text.
console.log(await ssrpg.getScreen(0, 0, 40, 20));
```

Values are converted automatically: `"True"`/`"False"` become booleans, integer
literals become numbers, everything else stays a string. `ssrpg.client` exposes the
raw `MindConnectClient` if you need the protocol itself.

In `async` mode, `step()` is unavailable and requests are fire-and-forget:

```ts
ssrpg.callAsync([["foe.name"]], (error, values) => {
  if (!error) console.log(values[0]);
});
```

## Errors

All errors extend `MindConnectError`:

| Error | Raised when |
| --- | --- |
| `ConnectFailedError` | the TCP connection could not be established |
| `ConnectionClosedError` | the connection dropped, or `disconnect()` was called |
| `ProtocolError` | the game sent something unparseable |
| `RequestTimeoutError` | a request went unanswered for `requestTimeoutMs` |
| `ModeError` | an operation was used in a mode that does not support it |

## Differences from the Python library

The wire protocol is unchanged; the API had to adapt to JavaScript, and a few
bugs were fixed along the way.

- **Everything that reads game state is `async`.** Bun sockets are non-blocking, so
  `ssrpg.foe.distance()` returns a promise. Queued commands stay synchronous.
- **`var` is method-based** (`get`/`set`/`has`) instead of Python's `__getitem__`
  subscripting.
- **Side-effecting calls are no longer cached.** In the Python version `draw.Clear()`,
  `screen.Next()`, `var.set(...)` and friends went through the per-step cache, so a
  second invocation in the same step was silently dropped. Here only reads are cached.
- **`var` and `storage` reads are never cached**, as the Python source intended.
- **Responses are framed properly.** The Python client assumed one `recv()` per
  message; this port buffers and frames incrementally, so large `multiCall`
  batches cannot be truncated or merged.
- **Responses are matched by request id**, so out-of-order or stale replies do not
  desynchronise the stream.
- **A dropped connection raises** `ConnectionClosedError` instead of making
  `step()` return silently (which turned the Python example's loop into a spin).
- **`getScreen` renders missing cells as spaces** rather than the literal `None`.
- `run()`, `AbortSignal` support, request timeouts and typed errors are additions.
- Version-mismatch warnings are logged once per session, not once per frame.
- `PascalCase` StoneScript function names are preserved (`item.GetCooldown`), while
  the lowercase command names stay lowercase (`equipR`, `brew`) — in both cases the
  JavaScript name is the StoneScript name.

## Limitations

Inherited from the protocol:

- StoneScript objects such as `ui.panel` are not available.
- MindConnect cannot be used from imported scripts.
- Only `int`, `bool` and `str` values are supported.
- The protocol and this interface are experimental and subject to change.

## API documentation

Every exported symbol carries TSDoc, so [TypeDoc](https://typedoc.org) can render
the full API reference:

```bash
bun run docs        # writes ./docs
bun run docs:watch  # rebuilds on change
```

Open `docs/index.html` afterwards. The build runs with TypeDoc's validation turned
up (`notDocumented`, `invalidLink`, `notExported`) and warnings treated as errors,
so it fails if a symbol loses its docs or a `{@link}` goes stale — worth running in
CI alongside `bun test`.

`docs/` is generated output and is not committed.

## Development

```bash
bun install
bun test          # unit tests + end-to-end tests against a mock MindConnect server
bun run typecheck
bun run docs
```

`test/mock-server.ts` implements enough of the game side of the protocol to exercise
the client without the game running.

## Project layout

```
src/
  index.ts        public exports
  interface.ts    SSRPGInterface — caching, stepping, high-level API
  client.ts       MindConnectClient — socket, framing, request correlation
  protocol.ts     wire format: packet building, value casting, signal parsing
  errors.ts       error types
  types.ts        shared types
  commands/       one module per StoneScript namespace
examples/test.ts  port of the Python SSRPGtest.py
typedoc.json      API reference build
```

## License

MIT. See [LICENSE](LICENSE) — original copyright ArtificialPotato and contributors.
