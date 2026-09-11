[ssrpg-bun](../wiki/globals) / ArgsOf

# Type Alias: ArgsOf\<N\>

> **ArgsOf**\<`N`\> = [`StoneScriptAPI`](../wiki/Interface.StoneScriptAPI)\[`N`\]\[`"args"`\]

Defined in: [src/schema/index.ts:44](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/index.ts#L44)

The argument list a given member expects.

## Type Parameters

### N

`N` *extends* [`CallName`](../wiki/TypeAlias.CallName)

The member name.

## Example

```ts
type A = ArgsOf<"foe.GetCount">; // [distance: number]
type B = ArgsOf<"foe.hp">;       // []
```
