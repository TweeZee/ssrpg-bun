[ssrpg-bun](../wiki/globals) / Position

# Interface: Position

Defined in: [src/commands/pos.ts:13](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pos.ts#L13)

`pos` — the player's position in world coordinates.

## See

[Screen.FromWorldX](../wiki/Interface.Screen#fromworldx) to convert these to screen coordinates.

## Methods

### x()

> **x**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/pos.ts:19](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pos.ts#L19)

Reads `pos.x`.

#### Returns

`Promise`\<`number` \| `null`\>

Horizontal world position.

***

### y()

> **y**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/pos.ts:26](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pos.ts#L26)

Reads `pos.y`.

#### Returns

`Promise`\<`number` \| `null`\>

Vertical world position.

***

### z()

> **z**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/pos.ts:33](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/pos.ts#L33)

Reads `pos.z`.

#### Returns

`Promise`\<`number` \| `null`\>

Depth lane the player stands in.
