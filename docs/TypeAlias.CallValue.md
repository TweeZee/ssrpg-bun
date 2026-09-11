[ssrpg-bun](../wiki/globals) / CallValue

# Type Alias: CallValue

> **CallValue** = `string` \| `number` \| `boolean` \| `null`

Defined in: [src/types.ts:56](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L56)

A value returned by StoneScript, converted to the closest JavaScript type.

## Remarks

`null` means the game had no value for the request — for instance
[Foe.distance](../wiki/Interface.Foe#distance) while no foe is on screen.

## See

[autoCast](../wiki/Function.autoCast) for the conversion rules.
