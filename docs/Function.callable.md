[ssrpg-bun](../wiki/globals) / callable

# Function: callable()

> **callable**\<`F`, `M`\>(`fn`, `members`): `F` & `M`

Defined in: [src/commands/base.ts:190](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L190)

Attaches members to a function so a namespace can be both called and
navigated, mirroring Python's `__call__`.

## Type Parameters

### F

`F` *extends* (...`args`) => `unknown`

The callable part, e.g. `() => Promise<string | null>`.

### M

`M` *extends* `object`

The members to attach.

## Parameters

### fn

`F`

The function to decorate. Mutated in place.

### members

`M`

Properties to define on `fn`.

## Returns

`F` & `M`

`fn`, typed as both callable and carrying `members`.

## Remarks

Uses `Object.defineProperty` rather than `Object.assign` because members such
as `name` and `length` shadow non-writable properties of the function
itself — assigning to them throws in strict mode.

## Example

```ts
const foe = callable(() => ns.str(""), { hp: () => ns.int("hp") });
await foe();    // foe
await foe.hp(); // foe.hp
```
