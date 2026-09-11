[ssrpg-bun](../wiki/globals) / RequestFor

# Type Alias: RequestFor\<N, A\>

> **RequestFor**\<`N`, `A`\> = `A` *extends* [`ArgList`](../wiki/TypeAlias.ArgList) ? readonly \[`N`, `...A`\] : `never`

Defined in: [src/schema/index.ts:99](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L99)

Builds the request tuples for one member, one per documented arity.

## Type Parameters

### N

`N` *extends* [`CallName`](../wiki/TypeAlias.CallName)

The member name.

### A

`A` = [`ArgsOf`](../wiki/TypeAlias.ArgsOf)\<`N`\>

Its argument list; do not pass this explicitly.

## Remarks

Distributes over `A`, so a member with two arities contributes two tuples.
