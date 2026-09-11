[ssrpg-bun](../wiki/globals) / ResultOf

# Type Alias: ResultOf\<N\>

> **ResultOf**\<`N`\> = [`Nullable`](../wiki/TypeAlias.Nullable)\<[`StoneScriptAPI`](../wiki/Interface.StoneScriptAPI)\[`N`\]\[`"returns"`\]\>

Defined in: [src/schema/index.ts:68](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L68)

What a given member resolves to, including how it can be absent.

## Type Parameters

### N

`N` *extends* [`CallName`](../wiki/TypeAlias.CallName)

The member name.

## Remarks

Booleans stay `boolean`, because the protocol reports a missing boolean as
false. Everything else gains `| null`, since the game returns no value for
things like [Foe.distance](../wiki/Interface.Foe#distance) with no foe on screen. Side-effecting
functions resolve to `null`.

## Example

```ts
type A = ResultOf<"foe.hp">;      // number | null
type B = ResultOf<"loc.begin">;   // boolean
type C = ResultOf<"math.Sqrt">;   // number | `${number}` | null
type D = ResultOf<"draw.Clear">;  // null
```
