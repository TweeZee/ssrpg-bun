[ssrpg-bun](../wiki/globals) / Storage

# Interface: Storage

Defined in: [src/commands/storage.ts:22](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L22)

**`Experimental`**

`storage` — the persistent key/value store of the in-game script.

## Remarks

Unlike [Variable](../wiki/Interface.Variable), these values survive between runs. None of the
accessors are cached, so a read after a write sees the new value within the
same step.

 The Python reference implementation left this class disabled
because it needs an InvocationContext on the game side, so the game may not
expose it over MindConnect yet.

## Methods

### Get()

> **Get**(`key`, `defaultValue?`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/storage.ts:32](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L32)

**`Experimental`**

Calls `storage.Get`.

#### Parameters

##### key

`string`

Storage key.

##### defaultValue?

[`Scalar`](../wiki/TypeAlias.Scalar)

Value for the game to fall back to when the key is
missing.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The stored value, or `null` when the key is missing and no
fallback was given.

***

### Set()

> **Set**(`key`, `value`): `Promise`\<`void`\>

Defined in: [src/commands/storage.ts:41](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L41)

**`Experimental`**

Calls `storage.Set`.

#### Parameters

##### key

`string`

Storage key.

##### value

[`Scalar`](../wiki/TypeAlias.Scalar)

Value to store.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the write.

***

### Has()

> **Has**(`key`): `Promise`\<`boolean`\>

Defined in: [src/commands/storage.ts:49](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L49)

**`Experimental`**

Calls `storage.Has`.

#### Parameters

##### key

`string`

Storage key.

#### Returns

`Promise`\<`boolean`\>

Whether the store holds that key.

***

### Delete()

> **Delete**(`key`): `Promise`\<`void`\>

Defined in: [src/commands/storage.ts:57](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L57)

**`Experimental`**

Calls `storage.Delete`.

#### Parameters

##### key

`string`

Storage key to remove.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### Incr()

> **Incr**(`key`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/storage.ts:65](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L65)

**`Experimental`**

Calls `storage.Incr` — increments a counter.

#### Parameters

##### key

`string`

Storage key to increment.

#### Returns

`Promise`\<`number` \| `null`\>

The value after incrementing.

***

### Keys()

> **Keys**(): `Promise`\<`string`[]\>

Defined in: [src/commands/storage.ts:73](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/storage.ts#L73)

**`Experimental`**

Calls `storage.Keys`.

#### Returns

`Promise`\<`string`[]\>

Every key in the store. Empty when the store is empty, since the
game returns the keys as one comma-separated string.
