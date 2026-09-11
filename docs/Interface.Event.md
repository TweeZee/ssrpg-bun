[ssrpg-bun](../wiki/globals) / Event

# Interface: Event

Defined in: [src/commands/event.ts:11](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/event.ts#L11)

`event` — objectives of the active in-game event.

## Methods

### GetObjectiveId()

> **GetObjectiveId**(`index`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/event.ts:18](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/event.ts#L18)

Calls `event.GetObjectiveId`.

#### Parameters

##### index

`number`

Zero-based objective index.

#### Returns

`Promise`\<`string` \| `null`\>

Id of that objective, or `null` when the index is out of range.

***

### GetObjectiveProgress()

> **GetObjectiveProgress**(`index`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/event.ts:26](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/event.ts#L26)

Calls `event.GetObjectiveProgress`.

#### Parameters

##### index

`number`

Zero-based objective index.

#### Returns

`Promise`\<`number` \| `null`\>

How far the objective has progressed.

***

### GetObjectiveGoal()

> **GetObjectiveGoal**(`index`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/event.ts:34](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/event.ts#L34)

Calls `event.GetObjectiveGoal`.

#### Parameters

##### index

`number`

Zero-based objective index.

#### Returns

`Promise`\<`number` \| `null`\>

The value the objective's progress has to reach.
