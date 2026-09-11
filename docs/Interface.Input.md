[ssrpg-bun](../wiki/globals) / Input

# Interface: Input

Defined in: [src/commands/input.ts:11](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/input.ts#L11)

`input` — the player's pointer position, in screen cells.

## Methods

### x()

> **x**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/input.ts:17](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/input.ts#L17)

Reads `input.x`.

#### Returns

`Promise`\<`number` \| `null`\>

Pointer column, or `null` when there is no pointer on screen.

***

### y()

> **y**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/input.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/input.ts#L24)

Reads `input.y`.

#### Returns

`Promise`\<`number` \| `null`\>

Pointer row, or `null` when there is no pointer on screen.
