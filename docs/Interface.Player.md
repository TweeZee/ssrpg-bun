[ssrpg-bun](../wiki/globals) / Player

# Interface: Player

Defined in: [src/commands/player.ts:14](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L14)

`player` — the player character.

## See

[Position](../wiki/Interface.Position) for where the player is,
[SSRPGInterface.hp](../wiki/Class.SSRPGInterface#hp) for how healthy they are.

## Methods

### direction()

> **direction**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/player.ts:21](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L21)

Reads `player.direction`.

#### Returns

`Promise`\<`number` \| `null`\>

The direction the player faces: positive for right, negative for
left.

***

### framesPerMove()

> **framesPerMove**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/player.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L29)

Reads `player.framesPerMove`.

#### Returns

`Promise`\<`number` \| `null`\>

How many frames the player needs to move one tile, which is the
inverse of movement speed.

***

### name()

> **name**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/player.ts:36](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L36)

Reads `player.name`.

#### Returns

`Promise`\<`string` \| `null`\>

The player's name.

***

### GetNextLegendName()

> **GetNextLegendName**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/player.ts:43](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L43)

Calls `player.GetNextLegendName`.

#### Returns

`Promise`\<`string` \| `null`\>

The name the next legend will be given.

***

### ShowScaredFace()

> **ShowScaredFace**(`time`): `Promise`\<`void`\>

Defined in: [src/commands/player.ts:51](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/player.ts#L51)

Calls `player.ShowScaredFace` — makes the player pull a scared face.

#### Parameters

##### time

`number`

How long to hold the expression, in frames.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.
