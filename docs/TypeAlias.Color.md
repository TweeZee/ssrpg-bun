[ssrpg-bun](../wiki/globals) / Color

# Type Alias: Color

> **Color** = `` `#${ColorPreset}` `` \| `` `#${string}` `` & `object`

Defined in: [src/schema/api.ts:78](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L78)

A colour: `#rrggbb` hexadecimal, or a `#`-prefixed preset.

## Remarks

Permissive about the digits so it stays a plain type, but it still catches
the common mistake of leaving off the `#`. For exact validation of the six
hex digits, use [StrictColor](../wiki/TypeAlias.StrictColor).
