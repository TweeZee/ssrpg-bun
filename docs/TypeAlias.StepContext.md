[ssrpg-bun](../wiki/globals) / StepContext

# Type Alias: StepContext

> **StepContext** = `"pre"` \| `"post"` \| `"exclusive"`

Defined in: [src/types.ts:35](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L35)

Which half of a game frame a step callback is running in.

## Remarks

`pre` and `post` only occur in `sync` mode; `exclusive` mode always reports
`exclusive`.

## See

[Mode](../wiki/TypeAlias.Mode)
