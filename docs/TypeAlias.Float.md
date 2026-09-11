[ssrpg-bun](../wiki/globals) / Float

# Type Alias: Float

> **Float** = `` `${number}` ``

Defined in: [src/schema/api.ts:39](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L39)

A StoneScript float.

## Remarks

The protocol is untyped and [autoCast](../wiki/Function.autoCast) only converts integer literals,
so a fractional value arrives as a numeric string. The template literal type
says exactly that, and `Number(value)` gets you a number.

## Example

```ts
const raw = await ssrpg.call("math.Sqrt", 2); // `${number}` | null
const root = raw === null ? null : Number(raw);
```
