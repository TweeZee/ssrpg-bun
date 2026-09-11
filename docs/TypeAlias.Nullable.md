[ssrpg-bun](../wiki/globals) / Nullable

# Type Alias: Nullable\<T\>

> **Nullable**\<`T`\> = \[`T`\] *extends* \[`boolean`\] ? `boolean` : \[`T`\] *extends* \[`null`\] ? `null` : `T` \| `null`

Defined in: [src/schema/index.ts:79](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L79)

Adds the absent case to a declared return type.

## Type Parameters

### T

`T`

The declared return type.

## Remarks

Booleans and side-effecting calls are left alone; everything else gains
`| null`.
