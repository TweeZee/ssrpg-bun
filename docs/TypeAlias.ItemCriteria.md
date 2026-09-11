[ssrpg-bun](../wiki/globals) / ItemCriteria

# Type Alias: ItemCriteria

> **ItemCriteria** = [`Loose`](../wiki/TypeAlias.Loose)\<[`SearchFilter`](../wiki/TypeAlias.SearchFilter) \| `` `*${number}` `` \| `` `+${number}` `` \| `` `-${string}` ``\>

Defined in: [src/schema/api.ts:1256](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1256)

One criterion of an item search.

## Remarks

A name fragment, a [SearchFilter](../wiki/TypeAlias.SearchFilter) tag, a `*n` star level, a `+n`
enchantment bonus, or any of those negated with `-`.
