[ssrpg-bun](../wiki/globals) / Loose

# Type Alias: Loose\<T\>

> **Loose**\<`T`\> = `T` \| `string` & `object`

Defined in: [src/schema/ids.ts:32](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/ids.ts#L32)

Widens a literal union so unknown values are still accepted, without losing
autocompletion for the documented ones.

## Type Parameters

### T

`T` *extends* `string`

The documented values.

## Remarks

The `string & {}` half is what stops the editor collapsing the union down
to plain `string`.

## Example

```ts
declare function play(sound: Loose<SoundId>): void;
play("bat_wing");   // autocompleted
play("new_sound");  // still allowed
```
