[ssrpg-bun](../wiki/globals) / CommandFlusher

# Interface: CommandFlusher

Defined in: [src/commands/command.ts:75](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L75)

The part of [SSRPGInterface](../wiki/Class.SSRPGInterface) a [CommandQueue](../wiki/Class.CommandQueue) needs in order to
flush itself.

## Methods

### multiCall()

> **multiCall**(`requests`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

Defined in: [src/commands/command.ts:82](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L82)

Sends several requests in a single round trip.

#### Parameters

##### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

One value per request.
