[ssrpg-bun](../wiki/globals) / Pickup

# Interface: Pickup()

Defined in: [src/commands/pickup.ts:15](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pickup.ts#L15)

`pickup` — the nearest item lying on the ground.

## Remarks

Call the namespace itself to read the item's name, mirroring StoneScript,
where `pickup` is both a variable and a class.

> **Pickup**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/pickup.ts:22](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pickup.ts#L22)

Reads `pickup`.

## Returns

`Promise`\<`string` \| `null`\>

Name of the nearest item on the ground, or `null` when there is
none.

## Methods

### distance()

> **distance**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/pickup.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pickup.ts#L29)

Reads `pickup.distance`.

#### Returns

`Promise`\<`number` \| `null`\>

Distance from the player, in tiles.

***

### z()

> **z**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/pickup.ts:36](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pickup.ts#L36)

Reads `pickup.z`.

#### Returns

`Promise`\<`number` \| `null`\>

Depth lane the item lies in.
