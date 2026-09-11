[ssrpg-bun](../wiki/globals) / PlayerBuffs

# Interface: PlayerBuffs

Defined in: [src/commands/buffs.ts:46](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L46)

The player's own buffs, which additionally expose `oldest`.

## Extends

- [`Buffs`](../wiki/Interface.Buffs)

## Methods

### count()

> **count**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/buffs.ts:17](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L17)

Reads `count`.

#### Returns

`Promise`\<`number` \| `null`\>

How many buffs are currently active.

#### Inherited from

[`Buffs`](../wiki/Interface.Buffs).[`count`](../wiki/Interface.Buffs#count)

***

### string()

> **string**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/buffs.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L24)

Reads `string`.

#### Returns

`Promise`\<`string` \| `null`\>

The collection rendered the way the game displays it.

#### Inherited from

[`Buffs`](../wiki/Interface.Buffs).[`string`](../wiki/Interface.Buffs#string)

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

#### Inherited from

[`Buffs`](../wiki/Interface.Buffs).[`GetCount`](../wiki/Interface.Buffs#getcount)

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

#### Inherited from

[`Buffs`](../wiki/Interface.Buffs).[`GetTime`](../wiki/Interface.Buffs#gettime)

***

### oldest()

> **oldest**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/buffs.ts:52](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L52)

Reads `oldest`.

#### Returns

`Promise`\<`string` \| `null`\>

Id of the buff that has been active longest.
