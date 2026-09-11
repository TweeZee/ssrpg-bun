[ssrpg-bun](../wiki/globals) / asBool

# Function: asBool()

> **asBool**(`value`): `boolean`

Defined in: [src/protocol.ts:174](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L174)

Narrows a call result to a boolean.

## Parameters

### value

[`CallValue`](../wiki/TypeAlias.CallValue)

A value produced by [autoCast](../wiki/Function.autoCast).

## Returns

`boolean`

Whether the game returned `True`.

## Remarks

Anything that is not exactly `true` is reported as `false`, mirroring
StoneScript, where a missing value is falsy.
