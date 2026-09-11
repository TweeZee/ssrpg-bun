[ssrpg-bun](../wiki/globals) / ResultOfSpec

# Type Alias: ResultOfSpec\<S\>

> **ResultOfSpec**\<`S`\> = `S` *extends* [`CallName`](../wiki/TypeAlias.CallName) ? [`ResultOf`](../wiki/TypeAlias.ResultOf)\<`S`\> : [`ResultOfRequest`](../wiki/TypeAlias.ResultOfRequest)\<`S`\>

Defined in: [src/schema/index.ts:147](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L147)

The result type of one [ReadSpec](../wiki/TypeAlias.ReadSpec).

## Type Parameters

### S

`S`

A bare member name or a request tuple.
