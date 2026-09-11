[ssrpg-bun](../wiki/globals) / Item

# Interface: Item

Defined in: [src/commands/item.ts:57](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L57)

`item` — the player's equipped items and inventory.

## Properties

### left

> `readonly` **left**: [`Head`](../wiki/Interface.Head)

Defined in: [src/commands/item.ts:129](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L129)

`item.left` — the item in the left hand.

***

### right

> `readonly` **right**: [`Head`](../wiki/Interface.Head)

Defined in: [src/commands/item.ts:132](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L132)

`item.right` — the item in the right hand.

## Methods

### CanActivate()

> **CanActivate**(`itemName?`): `Promise`\<`boolean`\>

Defined in: [src/commands/item.ts:67](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L67)

Calls `item.CanActivate`.

#### Parameters

##### itemName?

[`Loose`](../wiki/TypeAlias.Loose)\<[`AbilityId`](../wiki/TypeAlias.AbilityId)\>

Item to check. Omit to ask about the best candidate the
game would pick on its own.

#### Returns

`Promise`\<`boolean`\>

Whether the item can be activated right now.

#### See

[CommandQueue.activate](../wiki/Class.CommandQueue#activate)

***

### GetCooldown()

> **GetCooldown**(`ability`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:78](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L78)

Calls `item.GetCooldown`.

#### Parameters

##### ability

[`Loose`](../wiki/TypeAlias.Loose)\<[`AbilityId`](../wiki/TypeAlias.AbilityId)\>

Ability id; the documented ids autocomplete.

#### Returns

`Promise`\<`number` \| `null`\>

Frames left on the ability's cooldown, `0` when it is ready, or
`-1` for an unknown ability or one whose weapon has never been used.

#### See

Appendix A of the Stonescript manual.

***

### GetCount()

> **GetCount**(`criteria`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:86](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L86)

Calls `item.GetCount`.

#### Parameters

##### criteria

`string`

Search criteria, e.g. `"sword *0 -socket"`.

#### Returns

`Promise`\<`number` \| `null`\>

How many matching items the player carries; `0` for none.

***

### GetTreasureCount()

> **GetTreasureCount**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:93](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L93)

Calls `item.GetTreasureCount`.

#### Returns

`Promise`\<`number` \| `null`\>

How many treasures the player is carrying.

***

### GetTreasureLimit()

> **GetTreasureLimit**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:100](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L100)

Calls `item.GetTreasureLimit`.

#### Returns

`Promise`\<`number` \| `null`\>

How many treasures the player can carry.

***

### potion()

> **potion**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/item.ts:110](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L110)

Reads `item.potion`.

#### Returns

`Promise`\<`string` \| `null`\>

Name of the currently brewed potion, or `null` when there is
none.

#### See

[CommandQueue.brew](../wiki/Class.CommandQueue#brew)

***

### GetLoadoutL()

> **GetLoadoutL**(`loadout`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/item.ts:118](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L118)

Calls `item.GetLoadoutL`.

#### Parameters

##### loadout

`number`

Loadout slot to inspect.

#### Returns

`Promise`\<`string` \| `null`\>

Name of the left-hand item in that loadout.

***

### GetLoadoutR()

> **GetLoadoutR**(`loadout`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/item.ts:126](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L126)

Calls `item.GetLoadoutR`.

#### Parameters

##### loadout

`number`

Loadout slot to inspect.

#### Returns

`Promise`\<`string` \| `null`\>

Name of the right-hand item in that loadout.
