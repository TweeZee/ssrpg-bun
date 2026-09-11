[ssrpg-bun](../wiki/globals) / MultiCallResults

# Type Alias: MultiCallResults\<R\>

> **MultiCallResults**\<`R`\> = `{ -readonly [K in keyof R]: ResultOfRequest<R[K]> }`

Defined in: [src/schema/index.ts:120](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L120)

Narrows a batch of requests to a tuple of their individual result types.

## Type Parameters

### R

`R` *extends* readonly `unknown`[]

The request tuple, which needs `as const` or a `const` type
parameter to stay literal.

## Remarks

This is what makes destructuring a [SSRPGInterface.multiCall](../wiki/Class.SSRPGInterface#multicall) result
useful: each position carries the type of the request that produced it,
rather than a shared [CallValue](../wiki/TypeAlias.CallValue).

## Example

```ts
type R = MultiCallResults<[["foe.name"], ["foe.hp"], ["loc.begin"]]>;
// [string | null, number | null, boolean]
```
