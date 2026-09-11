[ssrpg-bun](../wiki/globals) / SSRPGInterface

# Class: SSRPGInterface

Defined in: [src/interface.ts:132](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L132)

The high-level interface to Stone Story RPG.

## Remarks

Wraps a [MindConnectClient](../wiki/Class.MindConnectClient) with the three things a script wants:
typed accessors for the StoneScript namespaces, a per-step cache so
repeated reads are free, and a command queue that is flushed once per step.

Everything that reads game state is `async`, because Bun sockets are
non-blocking. Everything that queues a command is synchronous — the request
only leaves when the step ends.

## Example

```ts
const ssrpg = new SSRPGInterface({ mode: "sync" });
await ssrpg.connect();

await ssrpg.run(async (context) => {
  if (context !== "pre") return;
  if (await ssrpg.loc.begin()) ssrpg.brew("tar", "wood");
  const distance = await ssrpg.foe.distance();
  if (distance !== null && distance < 8) ssrpg.activate("R");
});
```

## See

[Mode](../wiki/TypeAlias.Mode) for how the modes differ.

## Constructors

### Constructor

> **new SSRPGInterface**(`options?`): `SSRPGInterface`

Defined in: [src/interface.ts:226](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L226)

#### Parameters

##### options?

[`SSRPGInterfaceOptions`](../wiki/Interface.SSRPGInterfaceOptions) = `{}`

Mode and connection settings.

#### Returns

`SSRPGInterface`

#### Throws

[ModeError](../wiki/Class.ModeError) when `options.mode` is not a valid [Mode](../wiki/TypeAlias.Mode).

## Properties

### PROTOCOL\_VERSION

> `readonly` `static` **PROTOCOL\_VERSION**: `"0.3"`

Defined in: [src/interface.ts:138](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L138)

The MindConnect protocol version this class speaks.

#### See

[PROTOCOL\_VERSION](../wiki/Variable.PROTOCOL_VERSION)

***

### command

> `readonly` **command**: [`CommandQueue`](../wiki/Class.CommandQueue)

Defined in: [src/interface.ts:155](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L155)

The queue holding this step's commands.

#### Remarks

Every method is mirrored on the interface itself, so
`ssrpg.command.brew(...)` and `ssrpg.brew(...)` are the same call.

***

### ai

> `readonly` **ai**: [`AI`](../wiki/Interface.AI)

Defined in: [src/interface.ts:160](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L160)

`ai` — state of the in-game auto-pilot.

***

### armor

> `readonly` **armor**: [`Armor`](../wiki/Interface.Armor)

Defined in: [src/interface.ts:163](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L163)

`armor` — the player's armour.

***

### buffs

> `readonly` **buffs**: [`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Defined in: [src/interface.ts:166](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L166)

`buffs` — buffs currently on the player.

***

### debuffs

> `readonly` **debuffs**: [`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Defined in: [src/interface.ts:169](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L169)

`debuffs` — debuffs currently on the player.

***

### draw

> `readonly` **draw**: [`Draw`](../wiki/Interface.Draw)

Defined in: [src/interface.ts:172](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L172)

`draw` — direct drawing on the game screen.

***

### encounter

> `readonly` **encounter**: [`Encounter`](../wiki/Interface.Encounter)

Defined in: [src/interface.ts:175](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L175)

`encounter` — information about the encounter in progress.

***

### event

> `readonly` **event**: [`Event`](../wiki/Interface.Event)

Defined in: [src/interface.ts:178](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L178)

`event` — objectives of the active in-game event.

***

### foe

> `readonly` **foe**: [`Foe`](../wiki/Interface.Foe)

Defined in: [src/interface.ts:181](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L181)

`foe` — the foe the player is currently targeting.

***

### harvest

> `readonly` **harvest**: [`Harvest`](../wiki/Interface.Harvest)

Defined in: [src/interface.ts:184](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L184)

`harvest` — the nearest harvestable node.

***

### input

> `readonly` **input**: [`Input`](../wiki/Interface.Input)

Defined in: [src/interface.ts:187](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L187)

`input` — the player's pointer position.

***

### item

> `readonly` **item**: [`Item`](../wiki/Interface.Item)

Defined in: [src/interface.ts:190](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L190)

`item` — the player's equipped items and inventory.

***

### loc

> `readonly` **loc**: [`Loc`](../wiki/Interface.Loc)

Defined in: [src/interface.ts:193](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L193)

`loc` — the location the player is currently in.

***

### pickup

> `readonly` **pickup**: [`Pickup`](../wiki/Interface.Pickup)

Defined in: [src/interface.ts:196](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L196)

`pickup` — the nearest item lying on the ground.

***

### player

> `readonly` **player**: [`Player`](../wiki/Interface.Player)

Defined in: [src/interface.ts:199](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L199)

`player` — the player character.

***

### pos

> `readonly` **pos**: [`Position`](../wiki/Interface.Position)

Defined in: [src/interface.ts:202](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L202)

`pos` — the player's position in world coordinates.

***

### res

> `readonly` **res**: [`Resource`](../wiki/Interface.Resource)

Defined in: [src/interface.ts:205](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L205)

`res` — the player's carried resources.

***

### screen

> `readonly` **screen**: [`Screen`](../wiki/Interface.Screen)

Defined in: [src/interface.ts:208](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L208)

`screen` — the visible viewport and coordinate conversion.

***

### summon

> `readonly` **summon**: [`Summon`](../wiki/Interface.Summon)

Defined in: [src/interface.ts:211](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L211)

`summon` — the player's active summons.

***

### var

> `readonly` **var**: [`Variable`](../wiki/Interface.Variable)

Defined in: [src/interface.ts:214](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L214)

`var` — the Stonescript `var` dictionary shared with the in-game script.

***

### key

> `readonly` **key**: [`Key`](../wiki/Interface.Key)

Defined in: [src/interface.ts:216](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L216)

**`Experimental`**

Not enabled in the Python reference implementation.

***

### storage

> `readonly` **storage**: [`Storage`](../wiki/Interface.Storage)

Defined in: [src/interface.ts:218](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L218)

**`Experimental`**

Not enabled in the Python reference implementation.

***

### te

> `readonly` **te**: [`Text`](../wiki/Interface.Text)

Defined in: [src/interface.ts:220](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L220)

**`Experimental`**

Not enabled in the Python reference implementation.

## Accessors

### mode

#### Get Signature

> **get** **mode**(): [`Mode`](../wiki/TypeAlias.Mode)

Defined in: [src/interface.ts:272](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L272)

The mode this interface was constructed with.

##### Returns

[`Mode`](../wiki/TypeAlias.Mode)

***

### connected

#### Get Signature

> **get** **connected**(): `boolean`

Defined in: [src/interface.ts:281](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L281)

Whether the connection to the game is open.

##### See

[SSRPGInterface.run](../wiki/#run), which loops while this holds.

##### Returns

`boolean`

***

### client

#### Get Signature

> **get** **client**(): [`MindConnectClient`](../wiki/Class.MindConnectClient)

Defined in: [src/interface.ts:291](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L291)

The underlying client, for protocol-level access.

##### Remarks

Bypasses the cache, the command queue and the step lifecycle.

##### Returns

[`MindConnectClient`](../wiki/Class.MindConnectClient)

## Methods

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [src/interface.ts:308](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L308)

Opens the connection to the game.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the connection is open.

#### Remarks

The game must be running with the mindstone enabled, a
`//MindConnect: [mode]` header matching [SSRPGInterface.mode](../wiki/#mode) on the
first line of its Stonescript, and the player inside a location.

#### Throws

[ConnectFailedError](../wiki/Class.ConnectFailedError) when the game cannot be reached.

***

### disconnect()

> **disconnect**(): `void`

Defined in: [src/interface.ts:320](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L320)

Closes the connection.

#### Returns

`void`

#### Remarks

Safe to call more than once, and safe to call before connecting. Pending
requests and a pending [SSRPGInterface.step](../wiki/#step) reject with
[ConnectionClosedError](../wiki/Class.ConnectionClosedError).

***

### clearCache()

> **clearCache**(): `void`

Defined in: [src/interface.ts:331](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L331)

Forgets every cached call.

#### Returns

`void`

#### Remarks

Called automatically at the start of each step, so you only need this when
you drive [SSRPGInterface.call](../wiki/#call) outside the step lifecycle.

***

### step()

> **step**(`stepFunction`): `Promise`\<[`StepContext`](../wiki/TypeAlias.StepContext)\>

Defined in: [src/interface.ts:353](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L353)

Runs one step: waits for the next frame signal, clears the cache and the
command queue, runs your callback, flushes the queued commands and hands
control back to the game.

#### Parameters

##### stepFunction

[`StepFunction`](../wiki/TypeAlias.StepFunction)

Your logic for this step.

#### Returns

`Promise`\<[`StepContext`](../wiki/TypeAlias.StepContext)\>

The context the callback ran in.

#### Remarks

The game is paused for the whole call, so a slow callback slows the game
down. Control is handed back even when the callback throws.

#### Throws

[ModeError](../wiki/Class.ModeError) in `async` mode.

#### Throws

[ConnectionClosedError](../wiki/Class.ConnectionClosedError) when the game disconnects while
waiting for the next frame.

#### Throws

Whatever `stepFunction` throws.

***

### run()

> **run**(`stepFunction`, `options?`): `Promise`\<`void`\>

Defined in: [src/interface.ts:395](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L395)

Steps in a loop until the connection closes or the run is aborted.

#### Parameters

##### stepFunction

[`StepFunction`](../wiki/TypeAlias.StepFunction)

Your logic, called once per step.

##### options?

[`RunOptions`](../wiki/Interface.RunOptions) = `{}`

Abort handling.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the loop ends.

#### Remarks

A disconnect ends the loop normally rather than throwing, since the game
closing the connection — leaving a location, quitting — is the expected
way for a session to end. Any other error propagates.

#### Throws

[ModeError](../wiki/Class.ModeError) in `async` mode.

#### Throws

Whatever `stepFunction` throws.

#### Example

```ts
const controller = new AbortController();
process.on("SIGINT", () => controller.abort());
await ssrpg.run(step, { signal: controller.signal });
```

***

### call()

> **call**\<`N`\>(`name`, ...`args`): `Promise`\<[`ResultOf`](../wiki/TypeAlias.ResultOf)\<`N`\>\>

Defined in: [src/interface.ts:448](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L448)

Reads a variable or calls a function.

#### Type Parameters

##### N

`N` *extends* [`CallName`](../wiki/TypeAlias.CallName)

The member name, inferred from the argument.

#### Parameters

##### name

`N`

A member of the StoneScript API, e.g. `foe.name`.

##### args

...[`ArgsOf`](../wiki/TypeAlias.ArgsOf)\<`N`\>

The arguments that member takes.

#### Returns

`Promise`\<[`ResultOf`](../wiki/TypeAlias.ResultOf)\<`N`\>\>

The value, narrowed to that member's return type.

#### Remarks

The name is checked against [StoneScriptAPI](../wiki/Interface.StoneScriptAPI), so a typo is a compile
error, the argument list is the one that member actually takes, and the
result is narrowed to that member's own type instead of
[CallValue](../wiki/TypeAlias.CallValue).

The result is memoised for the rest of the current step, so repeated reads
of the same value cost one round trip. Concurrent reads share the pending
promise rather than issuing a second request. A failed call is evicted, so
it can be retried.

Do not use this for anything with side effects — use
[SSRPGInterface.callUncached](../wiki/#calluncached) instead, or the cache will swallow the
second call.

#### Example

```ts
const name = await ssrpg.call("foe.name");            // string | null
const near = await ssrpg.call("foe.GetCount", 8);     // number | null
const begin = await ssrpg.call("loc.begin");          // boolean
await ssrpg.call("foe.nope");                         // compile error
await ssrpg.call("foe.GetCount");                     // compile error
```

***

### callUncached()

> **callUncached**\<`N`\>(`name`, ...`args`): `Promise`\<[`ResultOf`](../wiki/TypeAlias.ResultOf)\<`N`\>\>

Defined in: [src/interface.ts:464](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L464)

Reads a variable or calls a function, bypassing the cache entirely.

#### Type Parameters

##### N

`N` *extends* [`CallName`](../wiki/TypeAlias.CallName)

The member name, inferred from the argument.

#### Parameters

##### name

`N`

A member of the StoneScript API, e.g. `var.get`.

##### args

...[`ArgsOf`](../wiki/TypeAlias.ArgsOf)\<`N`\>

The arguments that member takes.

#### Returns

`Promise`\<[`ResultOf`](../wiki/TypeAlias.ResultOf)\<`N`\>\>

The value, narrowed to that member's return type.

#### Remarks

The right choice for calls with side effects and for values the in-game
script can change mid-step. Typed exactly like [SSRPGInterface.call](../wiki/#call).

***

### multiCall()

> **multiCall**\<`R`\>(`requests`): `Promise`\<[`MultiCallResults`](../wiki/TypeAlias.MultiCallResults)\<`R`\>\>

Defined in: [src/interface.ts:493](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L493)

Sends several requests in a single round trip, narrowing each result.

#### Type Parameters

##### R

`R` *extends* readonly [`TypedRequest`](../wiki/TypeAlias.TypedRequest)[]

The request tuple, inferred as literal types.

#### Parameters

##### requests

`R`

The batch to send.

#### Returns

`Promise`\<[`MultiCallResults`](../wiki/TypeAlias.MultiCallResults)\<`R`\>\>

One narrowed value per request, in order.

#### Remarks

Never cached, in either direction. This is the cheapest way to read a lot
of state at once, since one packet replaces one round trip per value.

The returned tuple lines up with the requests position by position, each
carrying the type of the member that produced it — so destructuring gives
you real types rather than [CallValue](../wiki/TypeAlias.CallValue).

#### Example

```ts
const [name, hp, begin] = await ssrpg.multiCall([
  ["foe.name"],
  ["foe.hp"],
  ["loc.begin"],
]);
// name: string | null, hp: number | null, begin: boolean
```

***

### readAll()

> **readAll**\<`M`\>(`members`): `Promise`\<\{ \[K in string \| number \| symbol\]: ResultOfSpec\<M\[K\]\> \}\>

Defined in: [src/interface.ts:525](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L525)

Reads several members in one round trip and returns them by name.

#### Type Parameters

##### M

`M` *extends* `Readonly`\<`Record`\<`string`, [`ReadSpec`](../wiki/TypeAlias.ReadSpec)\>\>

The map of result names to members, inferred as literals.

#### Parameters

##### members

`M`

What to read, keyed by the name you want it under.

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: ResultOfSpec\<M\[K\]\> \}\>

One property per key, narrowed to that member's return type.

#### Remarks

The result object has exactly the keys you passed, each narrowed to the
type of the member behind it. A value is either a bare member name or a
request tuple when it needs arguments. Not cached.

#### Example

```ts
const state = await ssrpg.readAll({
  hp: "hp",
  foe: "foe.name",
  nearby: ["foe.GetCount", 8],
  starting: "loc.begin",
});
// state.hp: number | null
// state.foe: string | null
// state.nearby: number | null
// state.starting: boolean
```

***

### callRaw()

> **callRaw**(`command`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/interface.ts:555](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L555)

Reads a variable or calls a function without checking the name.

#### Parameters

##### command

`string`

Fully qualified StoneScript name.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The value, converted by [autoCast](../wiki/Function.autoCast).

#### Remarks

The escape hatch for a member this library does not know yet — a new game
version, or a name the schema is missing. Cached like
[SSRPGInterface.call](../wiki/#call), but the result is the untyped
[CallValue](../wiki/TypeAlias.CallValue).

***

### callUncachedRaw()

> **callUncachedRaw**(`command`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/interface.ts:574](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L574)

Reads a variable or calls a function without checking the name or caching
the result.

#### Parameters

##### command

`string`

Fully qualified StoneScript name.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The value, converted by [autoCast](../wiki/Function.autoCast).

***

### multiCallRaw()

> **multiCallRaw**(`requests`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

Defined in: [src/interface.ts:585](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L585)

Sends several requests in a single round trip without checking the names.

#### Parameters

##### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

One untyped value per request, in order.

***

### callAsync()

> **callAsync**(`requests`, `callback`): `void`

Defined in: [src/interface.ts:601](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L601)

Fire-and-forget request for `async` mode.

#### Parameters

##### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send.

##### callback

(`error`, `values`) => `void`

Node-style callback: an error and no values, or `null`
and one value per request.

#### Returns

`void`

#### Remarks

Present for parity with the Python library. In Bun every call is already a
promise, so [SSRPGInterface.multiCall](../wiki/#multicall) is usually what you want.

#### Throws

[ModeError](../wiki/Class.ModeError) outside `async` mode.

***

### queue()

> **queue**\<`N`\>(`name`, ...`args`): `void`

Defined in: [src/interface.ts:621](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L621)

Queues a request to be sent when the current step ends.

#### Type Parameters

##### N

`N` *extends* [`QueueName`](../wiki/TypeAlias.QueueName)

The member or command name, inferred from the argument.

#### Parameters

##### name

`N`

A queueable StoneScript name, e.g. `loc.Pause`.

##### args

...[`QueueArgsOf`](../wiki/TypeAlias.QueueArgsOf)\<`N`\>

The arguments that name takes.

#### Returns

`void`

***

### queueRaw()

> **queueRaw**(`command`, ...`args`): `void`

Defined in: [src/interface.ts:631](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L631)

Queues a request without checking the name.

#### Parameters

##### command

`string`

Fully qualified StoneScript name.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass along.

#### Returns

`void`

***

### getScreen()

> **getScreen**(`x`, `y`, `w`, `h`): `Promise`\<`string`\>

Defined in: [src/interface.ts:652](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L652)

Reads a rectangular block of the screen as text.

#### Parameters

##### x

`number`

Screen column of the top-left cell.

##### y

`number`

Screen row of the top-left cell.

##### w

`number`

Width in cells. A non-positive value yields an empty string.

##### h

`number`

Height in cells. A non-positive value yields an empty string.

#### Returns

`Promise`\<`string`\>

The block, one line per row, with empty cells as spaces.

#### Remarks

Issues one `draw.GetSymbol` per cell, batched into a single round trip.

#### Example

```ts
console.log(await ssrpg.getScreen(0, 0, 40, 20));
```

***

### time()

> **time**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:680](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L680)

Reads `time`.

#### Returns

`Promise`\<`number` \| `null`\>

Frames elapsed in the current location.

***

### totaltime()

> **totaltime**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:689](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L689)

Reads `totaltime`.

#### Returns

`Promise`\<`number` \| `null`\>

Frames elapsed since the run started.

***

### hp()

> **hp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:698](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L698)

Reads `hp`.

#### Returns

`Promise`\<`number` \| `null`\>

The player's current health.

***

### maxhp()

> **maxhp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:707](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L707)

Reads `maxhp`.

#### Returns

`Promise`\<`number` \| `null`\>

The player's maximum health.

***

### maxarmor()

> **maxarmor**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:718](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L718)

Reads `maxarmor`.

#### Returns

`Promise`\<`number` \| `null`\>

The player's maximum armour.

#### See

[SSRPGInterface.armor](../wiki/#armor) for the current value.

***

### face()

> **face**(): `Promise`\<`string` \| `null`\>

Defined in: [src/interface.ts:727](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L727)

Reads `face`.

#### Returns

`Promise`\<`string` \| `null`\>

The player's current facial expression.

***

### bighead()

> **bighead**(): `Promise`\<`boolean`\>

Defined in: [src/interface.ts:737](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L737)

Reads `bighead`.

#### Returns

`Promise`\<`boolean`\>

Whether big-head mode is on.

***

### totalgp()

> **totalgp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/interface.ts:748](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L748)

Reads `totalgp`.

#### Returns

`Promise`\<`number` \| `null`\>

Total gold pieces collected.

#### See

[Loc.gp](../wiki/Interface.Loc#gp) for this location alone.

***

### print()

> **print**(`text`, `options?`): `void`

Defined in: [src/interface.ts:762](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L762)

Queues `>` — prints text to the screen.

#### Parameters

##### text

[`PrintArg`](../wiki/TypeAlias.PrintArg) \| readonly [`PrintArg`](../wiki/TypeAlias.PrintArg)[]

What to print; an array is concatenated without a separator.

##### options?

[`PrintOptions`](../wiki/Interface.PrintOptions)

Where and how to draw it.

#### Returns

`void`

#### See

[CommandQueue.print](../wiki/Class.CommandQueue#print)

***

### play()

> **play**(`sound`, `pitch?`): `void`

Defined in: [src/interface.ts:774](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L774)

Queues `play` — plays a sound effect.

#### Parameters

##### sound

[`Loose`](../wiki/TypeAlias.Loose)\<[`SoundId`](../wiki/TypeAlias.SoundId)\>

Sound id; the documented ids autocomplete.

##### pitch?

`number`

Playback pitch, `100` being unchanged.

#### Returns

`void`

#### See

[CommandQueue.play](../wiki/Class.CommandQueue#play)

***

### equipR()

> **equipR**(...`criteria`): `void`

Defined in: [src/interface.ts:786](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L786)

Queues `equipR` — equips an item to the right hand.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria: name fragments, filter tags, `*n` star
levels, `+n` enchantment bonuses, or `-` negations.

#### Returns

`void`

#### See

[CommandQueue.equipR](../wiki/Class.CommandQueue#equipr)

***

### equipL()

> **equipL**(...`criteria`): `void`

Defined in: [src/interface.ts:798](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L798)

Queues `equipL` — equips an item to the left hand.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria: name fragments, filter tags, `*n` star
levels, `+n` enchantment bonuses, or `-` negations.

#### Returns

`void`

#### See

[CommandQueue.equipL](../wiki/Class.CommandQueue#equipl)

***

### equip()

> **equip**(...`criteria`): `void`

Defined in: [src/interface.ts:810](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L810)

Queues `equip` — equips an item to whichever hand fits best.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria: name fragments, filter tags, `*n` star
levels, `+n` enchantment bonuses, or `-` negations.

#### Returns

`void`

#### See

[CommandQueue.equip](../wiki/Class.CommandQueue#equip)

***

### loadout()

> **loadout**(`index`): `void`

Defined in: [src/interface.ts:821](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L821)

Queues `loadout` — switches to a saved loadout.

#### Parameters

##### index

`number`

The loadout slot to switch to.

#### Returns

`void`

#### See

[CommandQueue.loadout](../wiki/Class.CommandQueue#loadout)

***

### activate()

> **activate**(`target`): `void`

Defined in: [src/interface.ts:832](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L832)

Queues `activate` — activates an item ability.

#### Parameters

##### target

[`ActivateTarget`](../wiki/TypeAlias.ActivateTarget)

A hand, the potion, or an ability id.

#### Returns

`void`

#### See

[CommandQueue.activate](../wiki/Class.CommandQueue#activate), [Item.CanActivate](../wiki/Interface.Item#canactivate)

***

### enable()

#### Call Signature

> **enable**(`feature`): `void`

Defined in: [src/interface.ts:843](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L843)

Queues `enable` — restores a game feature.

##### Parameters

###### feature

[`ToggleFeature`](../wiki/TypeAlias.ToggleFeature)

The feature to restore, or `hud` plus element flags.

##### Returns

`void`

##### See

[CommandQueue.enable](../wiki/Class.CommandQueue#enable)

#### Call Signature

> **enable**\<`F`\>(`hud`): `void`

Defined in: [src/interface.ts:844](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L844)

Queues `enable` — restores a game feature.

##### Type Parameters

###### F

`F` *extends* `string`

##### Parameters

###### hud

`` `hud ${HudOpts<F>}` ``

##### Returns

`void`

##### See

[CommandQueue.enable](../wiki/Class.CommandQueue#enable)

***

### disable()

#### Call Signature

> **disable**(`feature`): `void`

Defined in: [src/interface.ts:856](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L856)

Queues `disable` — turns a game feature off.

##### Parameters

###### feature

[`ToggleFeature`](../wiki/TypeAlias.ToggleFeature)

The feature to disable, or `hud` plus element flags.

##### Returns

`void`

##### See

[CommandQueue.disable](../wiki/Class.CommandQueue#disable)

#### Call Signature

> **disable**\<`F`\>(`hud`): `void`

Defined in: [src/interface.ts:857](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L857)

Queues `disable` — turns a game feature off.

##### Type Parameters

###### F

`F` *extends* `string`

##### Parameters

###### hud

`` `hud ${HudOpts<F>}` ``

##### Returns

`void`

##### See

[CommandQueue.disable](../wiki/Class.CommandQueue#disable)

***

### brew()

> **brew**(...`materials`): `void`

Defined in: [src/interface.ts:869](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L869)

Queues `brew` — brews a potion from the given materials.

#### Parameters

##### materials

...`string`[]

Material names, joined with `+` for the game.

#### Returns

`void`

#### See

[CommandQueue.brew](../wiki/Class.CommandQueue#brew), [Item.potion](../wiki/Interface.Item#potion)
