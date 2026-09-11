[ssrpg-bun](../wiki/globals) / Summon

# Interface: Summon

Defined in: [src/commands/summon.ts:15](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L15)

`summon` — the player's active summons.

## Remarks

Summons are addressed by index. Every accessor defaults to index `0`, the
first summon, and [Summon.count](../wiki/#count) tells you how many there are.

## Methods

### count()

> **count**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/summon.ts:21](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L21)

Reads `summon.count`.

#### Returns

`Promise`\<`number` \| `null`\>

How many summons are active.

***

### GetId()

> **GetId**(`index?`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/summon.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L29)

Calls `summon.GetId`.

#### Parameters

##### index?

`number`

Zero-based summon index. Defaults to `0`.

#### Returns

`Promise`\<`string` \| `null`\>

The summon's internal id.

***

### GetName()

> **GetName**(`index?`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/summon.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L37)

Calls `summon.GetName`.

#### Parameters

##### index?

`number`

Zero-based summon index. Defaults to `0`.

#### Returns

`Promise`\<`string` \| `null`\>

The summon's display name.

***

### GetVar()

> **GetVar**(`varName`, `index?`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/summon.ts:46](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L46)

Calls `summon.GetVar`.

#### Parameters

##### varName

`string`

Name of the summon variable to read.

##### index?

`number`

Zero-based summon index. Defaults to `0`.

#### Returns

`Promise`\<`number` \| `null`\>

The variable's value.

***

### GetState()

> **GetState**(`index?`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/summon.ts:55](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L55)

Calls `summon.GetState`.

#### Parameters

##### index?

`number`

Zero-based summon index. Defaults to `0`.

#### Returns

`Promise`\<`number` \| `null`\>

The summon's state code; see the StoneScript documentation for
what each value means.

***

### GetTime()

> **GetTime**(`index?`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/summon.ts:63](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/summon.ts#L63)

Calls `summon.GetTime`.

#### Parameters

##### index?

`number`

Zero-based summon index. Defaults to `0`.

#### Returns

`Promise`\<`number` \| `null`\>

How long the summon has been in its current state, in frames.
