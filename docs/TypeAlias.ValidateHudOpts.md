[ssrpg-bun](../wiki/globals) / ValidateHudOpts

# Type Alias: ValidateHudOpts\<S\>

> **ValidateHudOpts**\<`S`\> = `S` *extends* `""` ? `true` : `S` *extends* `` `${infer Head}${infer Rest}` `` ? `Head` *extends* [`HudFlag`](../wiki/TypeAlias.HudFlag) ? `ValidateHudOpts`\<`Rest`\> : `false` : `false`

Defined in: [src/schema/api.ts:1227](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1227)

Recursive half of [HudOpts](../wiki/TypeAlias.HudOpts): peels one character at a time and checks
it against [HudFlag](../wiki/TypeAlias.HudFlag).

## Type Parameters

### S

`S` *extends* `string`

The remaining characters.
