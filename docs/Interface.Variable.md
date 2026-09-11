[ssrpg-bun](../wiki/globals) / Variable

# Interface: Variable

Defined in: [src/commands/var.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/var.ts#L29)

`var` — the Stonescript `var` dictionary, shared with the in-game script.

## Remarks

This is the intended channel for two-way communication in `sync` mode: the
in-game script and your script both read and write the same keys.

None of these accessors are cached, because the in-game script can change a
variable between two reads inside the same step. Where Python used
subscripting (`ssrpg.var["mode"]`), this port uses methods.

## Example

```ts
if (await ssrpg.var.has("mode")) {
  const mode = await ssrpg.var.get("mode");
  if (mode === "attack") await ssrpg.var.set("mode", "heal");
}
```

## Methods

### get()

> **get**(`key`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/var.ts:36](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/var.ts#L36)

Calls `var.get`.

#### Parameters

##### key

`string`

Variable name.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The value, or `null` when the variable does not exist.

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/commands/var.ts:46](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/var.ts#L46)

Calls `var.set`.

#### Parameters

##### key

`string`

Variable name.

##### value

[`Scalar`](../wiki/TypeAlias.Scalar)

Value to store. Booleans are sent as `1`/`0`, since the
protocol carries only integers and strings.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the write.

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

Defined in: [src/commands/var.ts:54](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/var.ts#L54)

Calls `var.has`.

#### Parameters

##### key

`string`

Variable name.

#### Returns

`Promise`\<`boolean`\>

Whether the in-game script has that variable.
