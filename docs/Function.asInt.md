[ssrpg-bun](../wiki/globals) / asInt

# Function: asInt()

> **asInt**(`value`): `number` \| `null`

Defined in: [src/protocol.ts:160](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L160)

Narrows a call result to an integer.

## Parameters

### value

[`CallValue`](../wiki/TypeAlias.CallValue)

A value produced by [autoCast](../wiki/Function.autoCast).

## Returns

`number` \| `null`

The number, or `null` when the game had no value or returned
something that is not an integer.
