[ssrpg-bun](../wiki/globals) / Loc

# Interface: Loc()

Defined in: [src/commands/loc.ts:25](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L25)

`loc` — the location the player is currently in.

## Remarks

Call the namespace itself to read the location's name, mirroring
StoneScript, where `loc` is both a variable and a class.

[Loc.Leave](../wiki/#leave) and [Loc.Pause](../wiki/#pause) are commands rather than reads, so
they are queued and take effect at the end of the step.

## Example

```ts
if (await ssrpg.loc.begin()) {
  // first frame of the location — reset per-run state here
}
```

> **Loc**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/loc.ts:31](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L31)

Reads `loc`.

## Returns

`Promise`\<`string` \| `null`\>

The location's display name.

## Methods

### id()

> **id**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/loc.ts:38](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L38)

Reads `loc.id`.

#### Returns

`Promise`\<`string` \| `null`\>

The location's internal id, e.g. `caustic_caves`.

***

### name()

> **name**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/loc.ts:45](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L45)

Reads `loc.name`.

#### Returns

`Promise`\<`string` \| `null`\>

The location's display name.

***

### stars()

> **stars**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/loc.ts:52](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L52)

Reads `loc.stars`.

#### Returns

`Promise`\<`number` \| `null`\>

How many stars the player has earned here.

***

### begin()

> **begin**(): `Promise`\<`boolean`\>

Defined in: [src/commands/loc.ts:60](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L60)

Reads `loc.begin`.

#### Returns

`Promise`\<`boolean`\>

`true` during the first frame of the location, which is the place
to reset per-run state.

***

### loop()

> **loop**(): `Promise`\<`boolean`\>

Defined in: [src/commands/loc.ts:67](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L67)

Reads `loc.loop`.

#### Returns

`Promise`\<`boolean`\>

Whether the location has looped back to its start.

***

### bestTime()

> **bestTime**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/loc.ts:74](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L74)

Reads `loc.bestTime`.

#### Returns

`Promise`\<`number` \| `null`\>

The player's best completion time here, in frames.

***

### averageTime()

> **averageTime**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/loc.ts:81](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L81)

Reads `loc.averageTime`.

#### Returns

`Promise`\<`number` \| `null`\>

The player's average completion time here, in frames.

***

### isQuest()

> **isQuest**(): `Promise`\<`boolean`\>

Defined in: [src/commands/loc.ts:88](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L88)

Reads `loc.isQuest`.

#### Returns

`Promise`\<`boolean`\>

Whether this location is a quest.

***

### gp()

> **gp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/loc.ts:95](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L95)

Reads `loc.gp`.

#### Returns

`Promise`\<`number` \| `null`\>

Gold pieces collected in this location so far.

***

### Leave()

> **Leave**(): `void`

Defined in: [src/commands/loc.ts:100](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L100)

Queues `loc.Leave` — leaves the location at the end of the step.

#### Returns

`void`

***

### Pause()

> **Pause**(): `void`

Defined in: [src/commands/loc.ts:105](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/loc.ts#L105)

Queues `loc.Pause` — pauses the game at the end of the step.

#### Returns

`void`
