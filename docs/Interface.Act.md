[ssrpg-bun](../wiki/globals) / Act

# Interface: Act\<A\>

Defined in: [src/schema/api.ts:149](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L149)

A function called for its side effect, which yields no value.

## Type Parameters

### A

`A` *extends* [`ArgList`](../wiki/TypeAlias.ArgList) = \[\]

The argument list, or a union of them for several arities.

## Properties

### args

> **args**: `A`

Defined in: [src/schema/api.ts:151](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L151)

The arguments the function takes.

***

### returns

> **returns**: `null`

Defined in: [src/schema/api.ts:153](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L153)

Side-effecting calls yield nothing.
