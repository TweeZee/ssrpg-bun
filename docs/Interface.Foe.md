[ssrpg-bun](../wiki/globals) / Foe

# Interface: Foe()

Defined in: [src/commands/foe.ts:25](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L25)

`foe` — the foe the player is currently targeting.

## Remarks

Call the namespace itself to read the foe's name, mirroring StoneScript,
where `foe` is both a variable and a class. Every member resolves to `null`
when no foe is targeted, so guard on the value rather than assuming a foe
is present.

## Example

```ts
const name = await ssrpg.foe();
const distance = await ssrpg.foe.distance();
if (distance !== null && distance < 8) ssrpg.activate("R");
```

> **Foe**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/foe.ts:31](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L31)

Reads `foe`.

## Returns

`Promise`\<`string` \| `null`\>

The foe's display name, or `null` when nothing is targeted.

## Properties

### buffs

> `readonly` **buffs**: [`Buffs`](../wiki/Interface.Buffs)

Defined in: [src/commands/foe.ts:134](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L134)

`foe.buffs` — buffs currently on the foe.

***

### debuffs

> `readonly` **debuffs**: [`Buffs`](../wiki/Interface.Buffs)

Defined in: [src/commands/foe.ts:137](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L137)

`foe.debuffs` — debuffs currently on the foe.

## Methods

### id()

> **id**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/foe.ts:38](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L38)

Reads `foe.id`.

#### Returns

`Promise`\<`string` \| `null`\>

The foe's internal id, which is stable across languages.

***

### name()

> **name**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/foe.ts:45](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L45)

Reads `foe.name`.

#### Returns

`Promise`\<`string` \| `null`\>

The foe's display name.

***

### damage()

> **damage**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:52](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L52)

Reads `foe.damage`.

#### Returns

`Promise`\<`number` \| `null`\>

Damage the foe deals per hit.

***

### distance()

> **distance**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:59](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L59)

Reads `foe.distance`.

#### Returns

`Promise`\<`number` \| `null`\>

Distance from the player, in tiles.

***

### z()

> **z**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:66](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L66)

Reads `foe.z`.

#### Returns

`Promise`\<`number` \| `null`\>

Depth lane the foe stands in.

***

### count()

> **count**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:73](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L73)

Reads `foe.count`.

#### Returns

`Promise`\<`number` \| `null`\>

How many foes are on screen.

***

### GetCount()

> **GetCount**(`distance`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:81](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L81)

Calls `foe.GetCount`.

#### Parameters

##### distance

`number`

Maximum distance from the player, in tiles.

#### Returns

`Promise`\<`number` \| `null`\>

How many foes are within `distance`.

***

### hp()

> **hp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:88](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L88)

Reads `foe.hp`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's current health.

***

### maxhp()

> **maxhp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:95](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L95)

Reads `foe.maxhp`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's maximum health.

***

### armor()

> **armor**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:102](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L102)

Reads `foe.armor`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's current armour.

***

### maxarmor()

> **maxarmor**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:109](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L109)

Reads `foe.maxarmor`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's maximum armour.

***

### state()

> **state**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:117](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L117)

Reads `foe.state`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's state code; see the StoneScript documentation for what
each value means.

***

### time()

> **time**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:124](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L124)

Reads `foe.time`.

#### Returns

`Promise`\<`number` \| `null`\>

How long the foe has been in its current state, in frames.

***

### level()

> **level**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/foe.ts:131](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/foe.ts#L131)

Reads `foe.level`.

#### Returns

`Promise`\<`number` \| `null`\>

The foe's level.
