[ssrpg-bun](../wiki/globals) / Screen

# Interface: Screen

Defined in: [src/commands/screen.ts:17](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L17)

`screen` — the visible viewport, plus conversion between world and screen
coordinates.

## Remarks

[Screen.Next](../wiki/#next), [Screen.Previous](../wiki/#previous) and [Screen.ResetOffset](../wiki/#resetoffset)
are immediate calls that bypass the per-step cache, so calling one twice in
a step really scrolls twice.

## Methods

### i()

> **i**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:23](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L23)

Reads `screen.i`.

#### Returns

`Promise`\<`number` \| `null`\>

Index of the screen currently shown.

***

### x()

> **x**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:30](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L30)

Reads `screen.x`.

#### Returns

`Promise`\<`number` \| `null`\>

World column the left edge of the screen sits at.

***

### w()

> **w**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L37)

Reads `screen.w`.

#### Returns

`Promise`\<`number` \| `null`\>

Screen width in cells.

***

### h()

> **h**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:44](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L44)

Reads `screen.h`.

#### Returns

`Promise`\<`number` \| `null`\>

Screen height in cells.

***

### FromWorldX()

> **FromWorldX**(`value`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:52](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L52)

Calls `screen.FromWorldX`.

#### Parameters

##### value

`number`

A world x coordinate.

#### Returns

`Promise`\<`number` \| `null`\>

The matching screen column.

***

### FromWorldZ()

> **FromWorldZ**(`value`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:60](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L60)

Calls `screen.FromWorldZ`.

#### Parameters

##### value

`number`

A world z coordinate (depth lane).

#### Returns

`Promise`\<`number` \| `null`\>

The matching screen row.

***

### ToWorldX()

> **ToWorldX**(`value`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:68](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L68)

Calls `screen.ToWorldX`.

#### Parameters

##### value

`number`

A screen column.

#### Returns

`Promise`\<`number` \| `null`\>

The matching world x coordinate.

***

### ToWorldZ()

> **ToWorldZ**(`value`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/screen.ts:76](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L76)

Calls `screen.ToWorldZ`.

#### Parameters

##### value

`number`

A screen row.

#### Returns

`Promise`\<`number` \| `null`\>

The matching world z coordinate.

***

### Next()

> **Next**(): `Promise`\<`void`\>

Defined in: [src/commands/screen.ts:83](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L83)

Calls `screen.Next` — scrolls to the next screen.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### Previous()

> **Previous**(): `Promise`\<`void`\>

Defined in: [src/commands/screen.ts:90](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L90)

Calls `screen.Previous` — scrolls to the previous screen.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### ResetOffset()

> **ResetOffset**(): `Promise`\<`void`\>

Defined in: [src/commands/screen.ts:97](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/screen.ts#L97)

Calls `screen.ResetOffset` — recentres the view on the player.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.
