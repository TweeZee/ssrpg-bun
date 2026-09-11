[ssrpg-bun](../wiki/globals) / Fn

# Interface: Fn\<A, T\>

Defined in: [src/schema/api.ts:137](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L137)

A callable function.

## Type Parameters

### A

`A` *extends* [`ArgList`](../wiki/TypeAlias.ArgList)

The argument list, or a union of them for several arities.

### T

`T`

The declared return type.

## Properties

### args

> **args**: `A`

Defined in: [src/schema/api.ts:139](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L139)

The arguments the function takes.

***

### returns

> **returns**: `T`

Defined in: [src/schema/api.ts:141](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L141)

What calling it yields.
