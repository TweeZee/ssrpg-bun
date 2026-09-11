# ssrpg-bun

A Bun/TypeScript interface for [Stone Story RPG](https://stonestoryrpg.com/) (v4.25.0 or above),
letting you drive the game from a TypeScript script over the MindConnect protocol.

This is a port of [SSRPGInterface](https://github.com/artificial-potato/SSRPGInterface)
(MindConnect protocol **v0.3**) by ArtificialPotato.

## Features

- **The whole StoneScript API, typed.** 234 members modelled at the type level, so `ssrpg.call("foe.hp")` resolves to `number | null`, `ssrpg.call("loc.begin")` to `boolean`, and `ssrpg.call("foe.hitpoints")` to a compile error.
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
| `ssrpg.play(sound, pitch?)` | `play` |
| `ssrpg.equip(...criteria)` / `equipL` / `equipR` | `equip` / `equipL` / `equipR` |
| `ssrpg.loadout(index)` | `loadout` |
| `ssrpg.activate(target)` | `activate` |
| `ssrpg.enable(feature)` / `ssrpg.disable(feature)` | `enable` / `disable` |
| `ssrpg.brew(...materials)` | `brew` |
| `ssrpg.loc.Leave()` / `ssrpg.loc.Pause()` | `loc.Leave` / `loc.Pause` |

`print` options: `x`, `y`, `color` (`#rrggbb` or a preset such as `#red`), and the
mutually exclusive anchors `face`, `player`, `head`, `foe`, `center`. Pass an array as
the first argument to concatenate several values.

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

Namespaces the manual documents but this library does not wrap in an object —
`math`, `string`, `color`, `music`, `ambient`, `sys`, `ui`, `int.Parse`, `Type` — are
all reachable through the typed `ssrpg.call`.

### Stonescript variables

```ts
await ssrpg.var.get("mode");           // read
await ssrpg.var.set("mode", "heal");   // write
await ssrpg.var.has("mode");           // exists?
```

These are never cached — the in-game script can change a variable between two reads
inside the same step.

## The typed StoneScript API

`call`, `multiCall`, `readAll` and `queue` are checked against
[`StoneScriptAPI`](src/schema/api.ts), a type-level model of the game's own API
built from the [Stonescript manual](https://stonestoryrpg.com/stonescript/beta.html)
(beta, v4.27.1). 234 members: every documented variable and every function whose
value can cross the wire.

### Names are checked, results are narrowed

```ts
const hp       = await ssrpg.call("hp");                    // number | null
const foeName  = await ssrpg.call("foe.name");              // string | null
const starting = await ssrpg.call("loc.begin");             // boolean
const symbol   = await ssrpg.call("draw.GetSymbol", 10, 5); // string | null

await ssrpg.call("foe.hitpoints");        // no such member
await ssrpg.call("foe.GetCount");         // needs a distance
await ssrpg.call("foe.GetCount", "far");  // and it has to be a number
await ssrpg.call("foe.hp", 1);            // takes no arguments
```

Each member carries the manual's own description, so the editor shows you what
`foe.state` means while you are completing the string.

Integers resolve to `number | null`, booleans to `boolean` (a missing boolean is
false in StoneScript), names to `string | null`, and side-effecting calls to
`null`. Floats are the interesting case: the protocol is untyped and only
integer literals are converted, so a fractional value arrives as a numeric
string — and the type says so with a template literal:

```ts
const root = await ssrpg.call("math.Sqrt", 2); // number | `${number}` | null
```

### Member families come from template literals

Both hands, both clocks, all four buff collections and the rest are generated
rather than listed, which is why `item.right.id`, `utc.hour`,
`foe.debuffs.GetTime` and `res.crystals` are all known — and `item.middle.gp`
and `res.copper` are not:

```ts
type Hand = "left" | "right";
type ItemHandAPI = { [K in `item.${Hand}`]: Read<string> } & {
  [K in `item.${Hand}.id`]: Read<string>;
} & { [K in `item.${Hand}.${"gp" | "state" | "time"}`]: Read<number> };
```

### Batches keep one type per position

```ts
const [name, health, begun] = await ssrpg.multiCall([
  ["foe.name"],
  ["foe.hp"],
  ["loc.begin"],
]);
// string | null, number | null, boolean — in one round trip
```

Or read by name and get back an object shaped like the request:

```ts
const state = await ssrpg.readAll({
  hp: "hp",
  foe: "foe.name",
  nearby: ["foe.GetCount", 8],
  starting: "loc.begin",
});
// state.hp: number | null, state.foe: string | null,
// state.nearby: number | null, state.starting: boolean
```

### Commands are checked too

Identifier sets come straight from the manual's appendices — 28 ability ids, 432
sound effects, 85 music tracks, 16 ambient loops, 22 bindable actions, 31 search
filters. The open ones are `Loose`, so documented values autocomplete while
anything else is still accepted:

```ts
ssrpg.activate("R");                                  // hand, potion or ability
ssrpg.play("bat_wing", 120);                          // sound id + pitch
ssrpg.equip("hammer", "*7", "-socket");               // criteria, filters, stars
ssrpg.print("careful!", { x: 1, y: 1, color: "#ff0000" });
ssrpg.disable("hud ru");                              // resources + utility belt
ssrpg.disable("hud rx");                              // 'x' is not a HUD flag
ssrpg.print("hi", { x: 1, y: 1, color: "ff0000" });   // a colour needs a '#'
ssrpg.loadout("1");                                   // a loadout is a number
```

`hud ru` is validated a character at a time, because enumerating the
combinations would mean every permutation of every subset of six flags:

```ts
type HudFlag = "p" | "f" | "a" | "r" | "b" | "u";
type ValidateHudOpts<S extends string> = S extends ""
  ? true
  : S extends `${infer Head}${infer Rest}`
    ? Head extends HudFlag ? ValidateHudOpts<Rest> : false
    : false;
```

`StrictColor<S>` does the same for `#rrggbb`, checking the six digits by
inference rather than building a union of 113 million members.

### Escape hatches

The schema tracks a moving target, so nothing is a dead end. `callRaw`,
`callUncachedRaw`, `multiCallRaw` and `queueRaw` take any name and return the
untyped `CallValue`:

```ts
const value = await ssrpg.callRaw("foe.somethingTheGameJustAdded");
```

To get a new member typed instead, extend the registry by declaration merging:

```ts
declare module "ssrpg-bun" {
  interface StoneScriptAPI {
    "foe.newThing": { args: []; returns: number };
  }
}
```

`examples/typed.ts` is a runnable tour of all of this, and `test/types.test-d.ts`
asserts the inferences — including that every invalid call above stays invalid.

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
- **`call` and friends only accept names the game has.** Python passed any string
  through; here an unknown name is a compile error and `callRaw` is the way out.
- **Command signatures follow the manual.** `play(sound, pitch?)`, `activate(target)`
  and `enable`/`disable(feature)` replace the Python variadics, which joined
  arbitrary arguments with spaces and let `activate("potion", "R")` build a payload
  the game does not parse.
- **`key.GetActKey1` is deprecated**: the manual documents `GetActKey`, `GetActKey2`
  and `GetKeyAct`, but no `GetActKey1`. The last of those is now available too.

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
so it fails if a symbol loses its docs or a `{@link}` goes stale.

`docs/` is generated output and is not committed.

## Regenerating the schema

```bash
bun run schema:sync    # fetch the manual and regenerate
bun run schema:check   # fail if anything is stale or drifted (for CI)
```

`scripts/sync-schema.ts` reads [the manual](https://stonestoryrpg.com/stonescript/beta.html)
and does three things:

1. Rewrites `src/schema/ids.ts` from the appendices. Fully generated — never
   hand-edit it.
2. Refreshes the per-member descriptions in `src/schema/api.ts`. Only doc blocks
   carrying the generated `@see ... in the Stonescript manual.` tag are rewritten,
   so hand-written ones survive. Idempotent.
3. Reports drift against `StoneScriptAPI`: members the manual has that the registry
   lacks, members the registry has that the manual dropped, and return types that
   disagree.

Argument lists and the template-literal families need judgement, so step 3 reports
rather than rewrites. The registry's keys are read by expanding
`keyof StoneScriptAPI` with the TypeScript compiler, so the families are checked as
thoroughly as the explicit entries.

Deliberate differences are recorded in the script itself, with a reason each:
`NOT_IN_REGISTRY` for members the protocol cannot carry (anything returning a
StoneScript object), `NOT_IN_MANUAL` for MindConnect's own `var.get`/`set`/`has`.
Anything not on those lists gets reported.

`--check` writes nothing and exits non-zero if a generated file is stale or drift is
unaccounted for. Pass `--from page.html` to work from a local copy, or `--url` to
point at another revision of the manual.

CI runs it on every push and pull request to `main`, and weekly — the manual is
published independently of this repo, so drift appears without anyone pushing. How
it reacts depends on what triggered it, because drift is rarely the fault of the
commit under test:

| Trigger | On drift |
| --- | --- |
| push, pull request | A warning and a run summary. The build stays green. |
| schedule (weekly) | Opens a `schema-drift` issue with the report, or stays quiet if one is already open. |
| manual run | Fails, for immediate feedback. |

## Publishing

`.github/workflows/publish.yml` publishes to [JSR](https://jsr.io), and is **prepared
but inactive** — the job is skipped unless the repository variable
`JSR_PUBLISH_ENABLED` is `true`, so neither a release nor a manual run can publish by
accident.

To switch it on:

1. Create the scope and package on [jsr.io](https://jsr.io). The name has to match
   `"name"` in `jsr.json` — currently `@tweezee/ssrpg-bun`, a placeholder for
   whatever scope you register.
2. Link this repository on the package's settings page. That is what lets the
   workflow authenticate over OIDC; there is no token to store.
3. Set `JSR_PUBLISH_ENABLED` to `true` under Settings → Secrets and variables →
   Actions → Variables.

Afterwards a published GitHub release publishes that version, and a manual run
publishes only when its dry-run input is unticked. Either way the workflow
typechecks, runs the tests, and refuses to continue unless `jsr.json`,
`package.json` and the release tag all carry the same version.

`bunx jsr publish --dry-run` runs the same checks locally, including JSR's
slow-types analysis of the public API.

## Development

```bash
bun install
bun test          # unit tests + end-to-end tests against a mock MindConnect server
bun run typecheck # includes the type-level assertions in test/types.test-d.ts
bun run docs
bun run schema:check
```

`.github/workflows/ci.yml` runs all four on every push and pull request to `main`,
as two parallel jobs: the deterministic checks in one, and the schema check — which
fetches an external page — in the other. Within the checks job the steps run even
after a failure, so one push reports every problem rather than only the first.

`test/mock-server.ts` implements enough of the game side of the protocol to exercise
the client without the game running. `test/types.test-d.ts` holds compile-time
assertions — it never runs, and a broken inference fails `bun run typecheck`.

## Project layout

```
src/
  index.ts        public exports
  schema/         the StoneScript API as types (ids.ts is generated)
  interface.ts    SSRPGInterface — caching, stepping, high-level API
  client.ts       MindConnectClient — socket, framing, request correlation
  protocol.ts     wire format: packet building, value casting, signal parsing
  errors.ts       error types
  types.ts        shared types
  commands/       one module per StoneScript namespace
examples/test.ts  port of the Python SSRPGtest.py
examples/typed.ts tour of the typed StoneScript surface
scripts/          schema:sync — regenerates the schema from the manual
typedoc.json      API reference build
jsr.json          JSR package manifest
```

## License

MIT. See [LICENSE](LICENSE) — original copyright ArtificialPotato and contributors.
