[ssrpg-bun](../wiki/globals) / PrintArg

# Type Alias: PrintArg

> **PrintArg** = [`Scalar`](../wiki/TypeAlias.Scalar) \| `null` \| `undefined`

Defined in: [src/commands/command.ts:32](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L32)

Anything that can be printed.

## Remarks

`null` and `undefined` render as an empty string, so optional values can be
passed straight through. Arrays are concatenated without a separator.
