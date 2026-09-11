[ssrpg-bun](../wiki/globals) / Harvest

# Interface: Harvest()

Defined in: [src/commands/harvest.ts:15](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/harvest.ts#L15)

`harvest` — the nearest harvestable node.

## Remarks

Call the namespace itself to read the node's name, mirroring StoneScript,
where `harvest` is both a variable and a class.

> **Harvest**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/harvest.ts:22](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/harvest.ts#L22)

Reads `harvest`.

## Returns

`Promise`\<`string` \| `null`\>

Name of the nearest harvestable node, or `null` when there is
none.

## Methods

### distance()

> **distance**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/harvest.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/harvest.ts#L29)

Reads `harvest.distance`.

#### Returns

`Promise`\<`number` \| `null`\>

Distance from the player, in tiles.

***

### z()

> **z**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/harvest.ts:36](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/harvest.ts#L36)

Reads `harvest.z`.

#### Returns

`Promise`\<`number` \| `null`\>

Depth lane the node sits in.
