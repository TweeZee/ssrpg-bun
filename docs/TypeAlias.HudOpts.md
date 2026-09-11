[ssrpg-bun](../wiki/globals) / HudOpts

# Type Alias: HudOpts\<S\>

> **HudOpts**\<`S`\> = `S` *extends* `""` ? `never` : [`ValidateHudOpts`](../wiki/TypeAlias.ValidateHudOpts)\<`S`\> *extends* `true` ? `S` : `never`

Defined in: [src/schema/api.ts:1215](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1215)

Validates a run of [HudFlag](../wiki/TypeAlias.HudFlag) letters, in any order.

## Type Parameters

### S

`S` *extends* `string`

The flag string to validate.

## Remarks

Resolves to `S` when every character is a HUD flag, and `never` otherwise.
Enumerating the combinations would mean every permutation of every subset,
so this walks the literal one character at a time instead.

## Example

```ts
type Ok = HudOpts<"ru">;  // "ru"
type No = HudOpts<"rx">;  // never
```
