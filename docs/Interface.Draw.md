[ssrpg-bun](../wiki/globals) / Draw

# Interface: Draw

Defined in: [src/commands/draw.ts:18](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L18)

`draw` — direct drawing on the game screen.

## Remarks

Unlike [CommandQueue.print](../wiki/Class.CommandQueue#print), these are immediate calls rather than
queued commands, so each one costs a round trip and takes effect straight
away. They deliberately bypass the per-step cache, so calling
[Draw.Clear](../wiki/#clear) twice in one step really clears twice.

## Methods

### Clear()

> **Clear**(): `Promise`\<`void`\>

Defined in: [src/commands/draw.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L24)

Calls `draw.Clear` — erases everything drawn this frame.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### Player()

> **Player**(`x?`, `y?`): `Promise`\<`void`\>

Defined in: [src/commands/draw.ts:34](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L34)

Calls `draw.Player` — draws the player sprite.

#### Parameters

##### x?

`number`

Screen column. Omit together with `y` to draw at the player's
own position.

##### y?

`number`

Screen row.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### Bg()

> **Bg**(`x`, `y`, `color`, `w?`, `h?`): `Promise`\<`void`\>

Defined in: [src/commands/draw.ts:46](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L46)

Calls `draw.Bg` — fills the background behind a cell or a block of cells.

#### Parameters

##### x

`number`

Screen column of the top-left cell.

##### y

`number`

Screen row of the top-left cell.

##### color

[`Color`](../wiki/TypeAlias.Color)

`#rrggbb`, or a preset such as `#red`.

##### w?

`number`

Block width. Omit together with `h` to fill a single cell.

##### h?

`number`

Block height.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### Box()

> **Box**(`x`, `y`, `w`, `h`, `color`, `style`): `Promise`\<`void`\>

Defined in: [src/commands/draw.ts:59](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L59)

Calls `draw.Box` — draws a rectangle outline.

#### Parameters

##### x

`number`

Screen column of the top-left corner.

##### y

`number`

Screen row of the top-left corner.

##### w

`number`

Width in cells.

##### h

`number`

Height in cells.

##### color

[`Color`](../wiki/TypeAlias.Color)

`#rrggbb`, or a preset such as `#red`.

##### style

`number`

Border style index, as defined by StoneScript.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### GetSymbol()

> **GetSymbol**(`x`, `y`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/draw.ts:70](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/draw.ts#L70)

Calls `draw.GetSymbol` — reads the symbol currently drawn at a position.

#### Parameters

##### x

`number`

Screen column.

##### y

`number`

Screen row.

#### Returns

`Promise`\<`string` \| `null`\>

The single-character symbol, or `null` for an empty cell.

#### See

[SSRPGInterface.getScreen](../wiki/Class.SSRPGInterface#getscreen) to read a whole block at once.
