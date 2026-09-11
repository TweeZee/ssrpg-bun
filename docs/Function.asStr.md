[ssrpg-bun](../wiki/globals) / asStr

# Function: asStr()

> **asStr**(`value`): `string` \| `null`

Defined in: [src/protocol.ts:184](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L184)

Narrows a call result to a string.

## Parameters

### value

[`CallValue`](../wiki/TypeAlias.CallValue)

A value produced by [autoCast](../wiki/Function.autoCast).

## Returns

`string` \| `null`

The value stringified, or `null` when the game had no value.
