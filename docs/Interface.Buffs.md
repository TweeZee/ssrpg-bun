[ssrpg-bun](../wiki/globals) / Buffs

# Interface: Buffs

Defined in: [src/commands/buffs.ts:11](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L11)

A buff or debuff collection, such as `buffs` or `foe.buffs`.

## Extended by

- [`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

## Methods

### count()

> **count**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/buffs.ts:17](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L17)

Reads `count`.

#### Returns

`Promise`\<`number` \| `null`\>

How many buffs are currently active.

***

### string()

> **string**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/buffs.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L24)

Reads `string`.

#### Returns

`Promise`\<`string` \| `null`\>

The collection rendered the way the game displays it.

***

### GetCount()

> **GetCount**(`buffName`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/buffs.ts:32](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L32)

Calls `GetCount`.

#### Parameters

##### buffName

`string`

Buff id, e.g. `"burn"`.

#### Returns

`Promise`\<`number` \| `null`\>

How many stacks of that buff are active; `0` when it is absent.

***

### GetTime()

> **GetTime**(`buffName`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/buffs.ts:40](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L40)

Calls `GetTime`.

#### Parameters

##### buffName

`string`

Buff id, e.g. `"burn"`.

#### Returns

`Promise`\<`number` \| `null`\>

Remaining duration of the buff, in frames.
