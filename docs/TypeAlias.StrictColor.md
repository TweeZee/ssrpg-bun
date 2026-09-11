[ssrpg-bun](../wiki/globals) / StrictColor

# Type Alias: StrictColor\<S\>

> **StrictColor**\<`S`\> = `S` *extends* `` `#${ColorPreset}` `` ? `S` : `S` *extends* `` `#${infer A}${infer B}${infer C}${infer D}${infer E}${infer F}` `` ? \[`A`, `B`, `C`, `D`, `E`, `F`\] *extends* \[[`HexDigit`](../wiki/TypeAlias.HexDigit), [`HexDigit`](../wiki/TypeAlias.HexDigit), [`HexDigit`](../wiki/TypeAlias.HexDigit), [`HexDigit`](../wiki/TypeAlias.HexDigit), [`HexDigit`](../wiki/TypeAlias.HexDigit), [`HexDigit`](../wiki/TypeAlias.HexDigit)\] ? `S` : `never` : `never`

Defined in: [src/schema/api.ts:105](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L105)

Validates a colour literal down to the individual digits.

## Type Parameters

### S

`S` *extends* `string`

The literal to validate.

## Remarks

Resolves to `S` when `S` is a `#`-prefixed preset or exactly six hex digits,
and to `never` otherwise. Never built as a union — 22 digits over six
positions would be 113 million members — so it works by inferring the six
characters and checking each one.

## Example

```ts
declare function tint<S extends string>(color: StrictColor<S>): void;
tint("#ff00ff"); // ok
tint("#red");    // ok
tint("#ff00f");  // Argument of type '"#ff00f"' is not assignable to 'never'
```
