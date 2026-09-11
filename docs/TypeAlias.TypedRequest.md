[ssrpg-bun](../wiki/globals) / TypedRequest

# Type Alias: TypedRequest

> **TypedRequest** = `{ [N in CallName]: RequestFor<N> }`\[[`CallName`](../wiki/TypeAlias.CallName)\]

Defined in: [src/schema/index.ts:88](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L88)

A request whose name is known and whose arguments match it.

## Remarks

A union over every member, so `["foe.GetCount", 5]` is accepted while
`["foe.GetCount"]` and `["foe.Nope"]` are not.
