[ssrpg-bun](../wiki/globals) / ResultOfRequest

# Type Alias: ResultOfRequest\<T\>

> **ResultOfRequest**\<`T`\> = `T` *extends* readonly \[infer N, `...unknown[]`\] ? `N` *extends* [`CallName`](../wiki/TypeAlias.CallName) ? [`ResultOf`](../wiki/TypeAlias.ResultOf)\<`N`\> : [`CallValue`](../wiki/TypeAlias.CallValue) : [`CallValue`](../wiki/TypeAlias.CallValue)

Defined in: [src/schema/index.ts:129](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L129)

The result type of one entry of a [MultiCallResults](../wiki/TypeAlias.MultiCallResults) tuple.

## Type Parameters

### T

`T`

A request tuple.
