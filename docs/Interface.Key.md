[ssrpg-bun](../wiki/globals) / Key

# Interface: Key()

Defined in: [src/commands/key.ts:19](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L19)

`key` — key bindings.

## Remarks

Call the namespace itself to read the key currently pressed.

 The Python reference implementation left this class disabled,
so the game may not expose it over MindConnect yet. Expect
[protocol errors](../wiki/Class.ProtocolError) or empty values.

> **Key**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:25](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L25)

**`Experimental`**

Reads `key`.

## Returns

`Promise`\<`string` \| `null`\>

The key currently pressed, or `null` when none is.

## Methods

### Bind()

> **Bind**(`action`, `key1`, `key2?`): `Promise`\<`void`\>

Defined in: [src/commands/key.ts:35](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L35)

**`Experimental`**

Calls `key.Bind` — binds an action to one or two keys.

#### Parameters

##### action

[`KeyAction`](../wiki/TypeAlias.KeyAction)

Action id to bind.

##### key1

[`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>

Primary key.

##### key2?

[`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>

Optional secondary key.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### GetActKey()

> **GetActKey**(`action`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:43](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L43)

**`Experimental`**

Calls `key.GetActKey`.

#### Parameters

##### action

[`KeyAction`](../wiki/TypeAlias.KeyAction)

Action id to look up.

#### Returns

`Promise`\<`string` \| `null`\>

The key bound to the action.

***

### ~~GetActKey1()~~

> **GetActKey1**(`action`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:55](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L55)

**`Experimental`**

Calls `key.GetActKey1`.

#### Parameters

##### action

[`KeyAction`](../wiki/TypeAlias.KeyAction)

Action id to look up.

#### Returns

`Promise`\<`string` \| `null`\>

The action's primary key.

#### Deprecated

The manual documents no such member; it was carried over from
the Python library. Use [Key.GetActKey](../wiki/#getactkey), which is the documented
name for the primary key.

***

### GetKeyAct()

> **GetKeyAct**(`key`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:63](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L63)

**`Experimental`**

Calls `key.GetKeyAct` — the reverse lookup of [Key.GetActKey](../wiki/#getactkey).

#### Parameters

##### key

[`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>

Key to look up.

#### Returns

`Promise`\<`string` \| `null`\>

The action bound to that key, or `"None"` when it is unbound.

***

### GetActKey2()

> **GetActKey2**(`action`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:71](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L71)

**`Experimental`**

Calls `key.GetActKey2`.

#### Parameters

##### action

[`KeyAction`](../wiki/TypeAlias.KeyAction)

Action id to look up.

#### Returns

`Promise`\<`string` \| `null`\>

The action's secondary key.

***

### GetActLabel()

> **GetActLabel**(`action`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/key.ts:79](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L79)

**`Experimental`**

Calls `key.GetActLabel`.

#### Parameters

##### action

[`KeyAction`](../wiki/TypeAlias.KeyAction)

Action id to look up.

#### Returns

`Promise`\<`string` \| `null`\>

The action's human-readable label.

***

### ResetBinds()

> **ResetBinds**(): `Promise`\<`void`\>

Defined in: [src/commands/key.ts:86](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/key.ts#L86)

**`Experimental`**

Calls `key.ResetBinds` — restores the default key bindings.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.
