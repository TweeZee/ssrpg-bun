[ssrpg-bun](../wiki/globals) / StoneScriptAPI

# Interface: StoneScriptAPI

Defined in: [src/schema/api.ts:265](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L265)

Every StoneScript name MindConnect can read or call, with its arguments and
return type.

## Remarks

Extend this through declaration merging when the game adds a member before
this library catches up:

```ts
declare module "ssrpg-bun" {
  interface StoneScriptAPI {
    "foe.newThing": { args: []; returns: number };
  }
}
```

## Extends

- `ItemHandAPI`.`BuffAPI`.`ClockAPI`.`ResourceAPI`.`MovementAPI`.`ScreenConvertAPI`.`MathUnaryAPI`.`MathToIntAPI`.`TranslateAPI`.`TimeFormatAPI`.`KeyLookupAPI`

## Properties

### item.left

> **item.left**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`ItemHandAPI.item.left`

***

### item.right

> **item.right**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`ItemHandAPI.item.right`

***

### item.left.id

> **item.left.id**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`ItemHandAPI.item.left.id`

***

### item.right.id

> **item.right.id**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`ItemHandAPI.item.right.id`

***

### item.left.time

> **item.left.time**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.left.time`

***

### item.left.gp

> **item.left.gp**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.left.gp`

***

### item.left.state

> **item.left.state**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.left.state`

***

### item.right.time

> **item.right.time**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.right.time`

***

### item.right.gp

> **item.right.gp**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.right.gp`

***

### item.right.state

> **item.right.state**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ItemHandAPI.item.right.state`

***

### buffs.count

> **buffs.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`BuffAPI.buffs.count`

***

### debuffs.count

> **debuffs.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`BuffAPI.debuffs.count`

***

### foe.buffs.count

> **foe.buffs.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`BuffAPI.foe.buffs.count`

***

### foe.debuffs.count

> **foe.debuffs.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`BuffAPI.foe.debuffs.count`

***

### buffs.string

> **buffs.string**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.buffs.string`

***

### debuffs.string

> **debuffs.string**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.debuffs.string`

***

### foe.buffs.string

> **foe.buffs.string**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.foe.buffs.string`

***

### foe.debuffs.string

> **foe.debuffs.string**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.foe.debuffs.string`

***

### buffs.GetCount

> **buffs.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.buffs.GetCount`

***

### buffs.GetTime

> **buffs.GetTime**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.buffs.GetTime`

***

### debuffs.GetCount

> **debuffs.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.debuffs.GetCount`

***

### debuffs.GetTime

> **debuffs.GetTime**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.debuffs.GetTime`

***

### foe.buffs.GetCount

> **foe.buffs.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.foe.buffs.GetCount`

***

### foe.buffs.GetTime

> **foe.buffs.GetTime**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.foe.buffs.GetTime`

***

### foe.debuffs.GetCount

> **foe.debuffs.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.foe.debuffs.GetCount`

***

### foe.debuffs.GetTime

> **foe.debuffs.GetTime**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

#### Inherited from

`BuffAPI.foe.debuffs.GetTime`

***

### buffs.oldest

> **buffs.oldest**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.buffs.oldest`

***

### debuffs.oldest

> **debuffs.oldest**: [`Read`](../wiki/Interface.Read)\<`string`\>

#### Inherited from

`BuffAPI.debuffs.oldest`

***

### time.year

> **time.year**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.year`

***

### time.month

> **time.month**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.month`

***

### time.day

> **time.day**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.day`

***

### time.hour

> **time.hour**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.hour`

***

### time.minute

> **time.minute**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.minute`

***

### time.second

> **time.second**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.time.second`

***

### utc.year

> **utc.year**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.year`

***

### utc.month

> **utc.month**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.month`

***

### utc.day

> **utc.day**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.day`

***

### utc.hour

> **utc.hour**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.hour`

***

### utc.minute

> **utc.minute**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.minute`

***

### utc.second

> **utc.second**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ClockAPI.utc.second`

***

### res.stone

> **res.stone**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.stone`

***

### res.wood

> **res.wood**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.wood`

***

### res.tar

> **res.tar**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.tar`

***

### res.ki

> **res.ki**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.ki`

***

### res.bronze

> **res.bronze**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.bronze`

***

### res.crystals

> **res.crystals**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`ResourceAPI.res.crystals`

***

### player.moveX

> **player.moveX**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`MovementAPI.player.moveX`

***

### player.moveZ

> **player.moveZ**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`MovementAPI.player.moveZ`

***

### player.moveAddX

> **player.moveAddX**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`MovementAPI.player.moveAddX`

***

### player.moveAddZ

> **player.moveAddZ**: [`Read`](../wiki/Interface.Read)\<`number`\>

#### Inherited from

`MovementAPI.player.moveAddZ`

***

### screen.FromWorldX

> **screen.FromWorldX**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`ScreenConvertAPI.screen.FromWorldX`

***

### screen.FromWorldZ

> **screen.FromWorldZ**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`ScreenConvertAPI.screen.FromWorldZ`

***

### screen.ToWorldX

> **screen.ToWorldX**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`ScreenConvertAPI.screen.ToWorldX`

***

### screen.ToWorldZ

> **screen.ToWorldZ**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`ScreenConvertAPI.screen.ToWorldZ`

***

### math.Abs

> **math.Abs**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Abs`

***

### math.Acos

> **math.Acos**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Acos`

***

### math.Asin

> **math.Asin**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Asin`

***

### math.Atan

> **math.Atan**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Atan`

***

### math.Ceil

> **math.Ceil**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Ceil`

***

### math.Cos

> **math.Cos**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Cos`

***

### math.Exp

> **math.Exp**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Exp`

***

### math.Floor

> **math.Floor**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Floor`

***

### math.Round

> **math.Round**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Round`

***

### math.Sign

> **math.Sign**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Sign`

***

### math.Sin

> **math.Sin**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Sin`

***

### math.Sqrt

> **math.Sqrt**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Sqrt`

***

### math.Tan

> **math.Tan**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.Tan`

***

### math.ToDeg

> **math.ToDeg**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.ToDeg`

***

### math.ToRad

> **math.ToRad**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

#### Inherited from

`MathUnaryAPI.math.ToRad`

***

### math.CeilToInt

> **math.CeilToInt**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`MathToIntAPI.math.CeilToInt`

***

### math.FloorToInt

> **math.FloorToInt**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`MathToIntAPI.math.FloorToInt`

***

### math.RoundToInt

> **math.RoundToInt**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

#### Inherited from

`MathToIntAPI.math.RoundToInt`

***

### te.xt

> **te.xt**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

#### Inherited from

`TranslateAPI.te.xt`

***

### te.GetTID

> **te.GetTID**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

#### Inherited from

`TranslateAPI.te.GetTID`

***

### te.ToEnglish

> **te.ToEnglish**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

#### Inherited from

`TranslateAPI.te.ToEnglish`

***

### time.FormatCasual

> **time.FormatCasual**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\] \| \[`number`, `boolean`\], `string`\>

#### Inherited from

`TimeFormatAPI.time.FormatCasual`

***

### time.FormatDigital

> **time.FormatDigital**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\] \| \[`number`, `boolean`\], `string`\>

#### Inherited from

`TimeFormatAPI.time.FormatDigital`

***

### key.GetActKey

> **key.GetActKey**: [`Fn`](../wiki/Interface.Fn)\<\[[`KeyAction`](../wiki/TypeAlias.KeyAction)\], `string`\>

#### Inherited from

`KeyLookupAPI.key.GetActKey`

***

### key.GetActKey2

> **key.GetActKey2**: [`Fn`](../wiki/Interface.Fn)\<\[[`KeyAction`](../wiki/TypeAlias.KeyAction)\], `string`\>

#### Inherited from

`KeyLookupAPI.key.GetActKey2`

***

### key.GetActLabel

> **key.GetActLabel**: [`Fn`](../wiki/Interface.Fn)\<\[[`KeyAction`](../wiki/TypeAlias.KeyAction)\], `string`\>

#### Inherited from

`KeyLookupAPI.key.GetActLabel`

***

### loc

> **loc**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:283](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L283)

The current location the player is visiting.

#### See

`loc` in the Stonescript manual.

***

### loc.id

> **loc.id**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:289](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L289)

The unique identifier of the current location.

#### See

`loc.id` in the Stonescript manual.

***

### loc.name

> **loc.name**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:295](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L295)

The localized name of the current location.

#### See

`loc.name` in the Stonescript manual.

***

### loc.gp

> **loc.gp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:301](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L301)

The total gear power used during the current run.

#### See

`loc.gp` in the Stonescript manual.

***

### loc.stars

> **loc.stars**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:307](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L307)

The current location's difficulty.

#### See

`loc.stars` in the Stonescript manual.

***

### loc.begin

> **loc.begin**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:314](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L314)

Is true only on the first frame of a location, when time = 0, before any
game simulation has run.

#### See

`loc.begin` in the Stonescript manual.

***

### loc.loop

> **loc.loop**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:320](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L320)

Is true on the first frame of a run after an Ouroboros loop.

#### See

`loc.loop` in the Stonescript manual.

***

### loc.isQuest

> **loc.isQuest**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:327](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L327)

True if the current location is a special location from a Legend or
custom quest.

#### See

`loc.isQuest` in the Stonescript manual.

***

### loc.averageTime

> **loc.averageTime**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:333](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L333)

The current location's average completion time.

#### See

`loc.averageTime` in the Stonescript manual.

***

### loc.bestTime

> **loc.bestTime**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:339](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L339)

The current location's best completion time (your record, high-score).

#### See

`loc.bestTime` in the Stonescript manual.

***

### loc.Leave

> **loc.Leave**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:346](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L346)

Causes the run to be abandoned as if the player had pressed to leave
manually.

#### See

`loc.Leave` in the Stonescript manual.

***

### loc.Pause

> **loc.Pause**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:353](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L353)

Causes the run to be paused as if the player had pressed the pause button
manually.

#### See

`loc.Pause` in the Stonescript manual.

***

### encounter.isElite

> **encounter.isElite**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:361](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L361)

Tells you if the current encounter is an elite encounter or not.

#### See

`encounter.isElite` in the Stonescript manual.

***

### encounter.eliteMod

> **encounter.eliteMod**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:367](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L367)

Tells you the special modifier, if any, for the current encounter.

#### See

`encounter.eliteMod` in the Stonescript manual.

***

### foe

> **foe**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:375](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L375)

The current foe being targeted by the player.

#### See

`foe` in the Stonescript manual.

***

### foe.id

> **foe.id**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:381](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L381)

The unique ID (or type) of the foe being targeted by the player.

#### See

`foe.id` in the Stonescript manual.

***

### foe.name

> **foe.name**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:387](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L387)

The localized name of the foe being targeted by the player.

#### See

`foe.name` in the Stonescript manual.

***

### foe.damage

> **foe.damage**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:393](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L393)

The damage per attack of the foe being targeted by the player.

#### See

`foe.damage` in the Stonescript manual.

***

### foe.distance

> **foe.distance**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:399](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L399)

The distance between the player and the foe being targeted.

#### See

`foe.distance` in the Stonescript manual.

***

### foe.z

> **foe.z**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:405](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L405)

The z position of the foe being targeted.

#### See

`foe.z` in the Stonescript manual.

***

### foe.count

> **foe.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:411](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L411)

The number of foes within 46 units of the player.

#### See

`foe.count` in the Stonescript manual.

***

### foe.GetCount

> **foe.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

Defined in: [src/schema/api.ts:417](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L417)

The number of foes within a specific number of units.

#### See

`foe.GetCount` in the Stonescript manual.

***

### foe.hp

> **foe.hp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:423](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L423)

The current hitpoints of the foe being targeted by the player.

#### See

`foe.hp` in the Stonescript manual.

***

### foe.maxhp

> **foe.maxhp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:429](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L429)

The maximum hitpoints of the foe being targeted by the player.

#### See

`foe.maxhp` in the Stonescript manual.

***

### foe.armor

> **foe.armor**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:435](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L435)

The current armor of the foe being targeted by the player.

#### See

`foe.armor` in the Stonescript manual.

***

### foe.maxarmor

> **foe.maxarmor**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:441](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L441)

The maximum armor of the foe being targeted by the player.

#### See

`foe.maxarmor` in the Stonescript manual.

***

### foe.state

> **foe.state**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:447](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L447)

A number representing the target foe's current state.

#### See

`foe.state` in the Stonescript manual.

***

### foe.time

> **foe.time**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:453](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L453)

Elapsed number of frames in target foe's current state.

#### See

`foe.time` in the Stonescript manual.

***

### foe.level

> **foe.level**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:459](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L459)

The level number of the target foe.

#### See

`foe.level` in the Stonescript manual.

***

### harvest

> **harvest**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:467](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L467)

The next harvestable object, such as a tree or boulder.

#### See

`harvest` in the Stonescript manual.

***

### harvest.distance

> **harvest.distance**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:473](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L473)

The distance between the player and the nearest harvestable object.

#### See

`harvest.distance` in the Stonescript manual.

***

### harvest.z

> **harvest.z**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:479](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L479)

The z position of the nearest harvestable object.

#### See

`harvest.z` in the Stonescript manual.

***

### pickup

> **pickup**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:485](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L485)

The current pickup being targeted by the player.

#### See

`pickup` in the Stonescript manual.

***

### pickup.distance

> **pickup.distance**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:491](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L491)

The distance between the player and the pickup being targeted.

#### See

`pickup.distance` in the Stonescript manual.

***

### pickup.z

> **pickup.z**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:497](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L497)

The z position of the pickup being targeted.

#### See

`pickup.z` in the Stonescript manual.

***

### input.x

> **input.x**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:505](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L505)

The X position, on the ASCII grid, of the input device (mouse/touch).

#### See

`input.x` in the Stonescript manual.

***

### input.y

> **input.y**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:511](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L511)

The Y position, on the ASCII grid, of the input device (mouse/touch).

#### See

`input.y` in the Stonescript manual.

***

### key

> **key**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:517](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L517)

The state of custom game input.

#### See

`key` in the Stonescript manual.

***

### key.Bind

> **key.Bind**: [`Act`](../wiki/Interface.Act)\<\[[`KeyAction`](../wiki/TypeAlias.KeyAction), [`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>\] \| \[[`KeyAction`](../wiki/TypeAlias.KeyAction), [`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>, [`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>\]\>

Defined in: [src/schema/api.ts:523](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L523)

Assigns a new set of keys to a specific action.

#### See

`key.Bind` in the Stonescript manual.

***

### key.GetKeyAct

> **key.GetKeyAct**: [`Fn`](../wiki/Interface.Fn)\<\[[`Loose`](../wiki/TypeAlias.Loose)\<[`KeyName`](../wiki/TypeAlias.KeyName)\>\], `string`\>

Defined in: [src/schema/api.ts:529](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L529)

Returns the action bound to a given key.

#### See

`key.GetKeyAct` in the Stonescript manual.

***

### key.ResetBinds

> **key.ResetBinds**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:535](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L535)

Resets all actions to their default key bindings.

#### See

`key.ResetBinds` in the Stonescript manual.

***

### item.potion

> **item.potion**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:543](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L543)

The potion currently brewed.

#### See

`item.potion` in the Stonescript manual.

***

### item.CanActivate

> **item.CanActivate**: [`Fn`](../wiki/Interface.Fn)\<\[\] \| \[[`Loose`](../wiki/TypeAlias.Loose)\<[`AbilityId`](../wiki/TypeAlias.AbilityId)\>\], `boolean`\>

Defined in: [src/schema/api.ts:549](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L549)

Returns true if it's possible to activate item abilities.

#### See

`item.CanActivate` in the Stonescript manual.

***

### item.GetCooldown

> **item.GetCooldown**: [`Fn`](../wiki/Interface.Fn)\<\[[`Loose`](../wiki/TypeAlias.Loose)\<[`AbilityId`](../wiki/TypeAlias.AbilityId)\>\], `number`\>

Defined in: [src/schema/api.ts:555](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L555)

Returns the remaining cooldown time (in frames) for a given ability.

#### See

`item.GetCooldown` in the Stonescript manual.

***

### item.GetCount

> **item.GetCount**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

Defined in: [src/schema/api.ts:561](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L561)

Returns the number of copies of an item in the inventory.

#### See

`item.GetCount` in the Stonescript manual.

***

### item.GetLoadoutL

> **item.GetLoadoutL**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `string`\>

Defined in: [src/schema/api.ts:567](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L567)

Returns the items in a specific loadout.

#### See

`item.GetLoadoutL` in the Stonescript manual.

***

### item.GetLoadoutR

> **item.GetLoadoutR**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `string`\>

Defined in: [src/schema/api.ts:573](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L573)

Returns the items in a specific loadout.

#### See

`item.GetLoadoutR` in the Stonescript manual.

***

### item.GetTreasureCount

> **item.GetTreasureCount**: [`Fn`](../wiki/Interface.Fn)\<\[\], `number`\>

Defined in: [src/schema/api.ts:579](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L579)

Returns the current number of treasure chests in your inventory.

#### See

`item.GetTreasureCount` in the Stonescript manual.

***

### item.GetTreasureLimit

> **item.GetTreasureLimit**: [`Fn`](../wiki/Interface.Fn)\<\[\], `number`\>

Defined in: [src/schema/api.ts:585](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L585)

Returns the total space for treasure chests in your inventory.

#### See

`item.GetTreasureLimit` in the Stonescript manual.

***

### hp

> **hp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:593](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L593)

The player's current hitpoints.

#### See

`hp` in the Stonescript manual.

***

### maxhp

> **maxhp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:599](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L599)

The player's maximum hitpoints.

#### See

`maxhp` in the Stonescript manual.

***

### armor

> **armor**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:605](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L605)

The player's current armor, rounded down.

#### See

`armor` in the Stonescript manual.

***

### armor.f

> **armor.f**: [`Read`](../wiki/Interface.Read)\<[`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:611](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L611)

The player's current armor's fractional amount.

#### See

`armor.f` in the Stonescript manual.

***

### maxarmor

> **maxarmor**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:617](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L617)

The player's maximum armor, rounded down.

#### See

`maxarmor` in the Stonescript manual.

***

### bighead

> **bighead**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:623](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L623)

True if the player has Big Head enabled (Moondial).

#### See

`bighead` in the Stonescript manual.

***

### face

> **face**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:629](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L629)

The player's current facial expression.

#### See

`face` in the Stonescript manual.

***

### totalgp

> **totalgp**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:636](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L636)

The total "Gear Power" of your inventory, calculated from item star
levels and enchantment bonuses.

#### See

`totalgp` in the Stonescript manual.

***

### pos.x

> **pos.x**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:642](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L642)

The player's current X position.

#### See

`pos.x` in the Stonescript manual.

***

### pos.y

> **pos.y**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:648](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L648)

The player's current Y position.

#### See

`pos.y` in the Stonescript manual.

***

### pos.z

> **pos.z**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:654](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L654)

The player's current Z position.

#### See

`pos.z` in the Stonescript manual.

***

### player.name

> **player.name**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:662](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L662)

The name chosen by the player.

#### See

`player.name` in the Stonescript manual.

***

### player.direction

> **player.direction**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:668](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L668)

Indicates the direction in which the player is facing.

#### See

`player.direction` in the Stonescript manual.

***

### player.framesPerMove

> **player.framesPerMove**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:674](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L674)

The amount of frames it takes the player to move one position forward.

#### See

`player.framesPerMove` in the Stonescript manual.

***

### player.GetNextLegendName

> **player.GetNextLegendName**: [`Fn`](../wiki/Interface.Fn)\<\[\], `string`\>

Defined in: [src/schema/api.ts:680](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L680)

The next unlocked Legend quest the player hasn't completed yet.

#### See

`player.GetNextLegendName` in the Stonescript manual.

***

### player.ShowScaredFace

> **player.ShowScaredFace**: [`Act`](../wiki/Interface.Act)\<\[`number`\]\>

Defined in: [src/schema/api.ts:687](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L687)

If the player has big-head enabled, their facial expression will change
to scared for a given amount of time.

#### See

`player.ShowScaredFace` in the Stonescript manual.

***

### ai.enabled

> **ai.enabled**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:695](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L695)

True if the AI is on, False if the AI is off (e.g.

#### See

`ai.enabled` in the Stonescript manual.

***

### ai.paused

> **ai.paused**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:702](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L702)

True if the AI is temporarily suspended, such as when waiting for a
treasure to drop.

#### See

`ai.paused` in the Stonescript manual.

***

### ai.idle

> **ai.idle**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:709](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L709)

True if the player is idle, waiting for something such as an attack to
complete.

#### See

`ai.idle` in the Stonescript manual.

***

### ai.walking

> **ai.walking**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:715](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L715)

True if the player is moving.

#### See

`ai.walking` in the Stonescript manual.

***

### time

> **time**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:723](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L723)

The current frame number of the location.

#### See

`time` in the Stonescript manual.

***

### totaltime

> **totaltime**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:730](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L730)

The current frame number of the location, accumulated in case of boss
sub-location.

#### See

`totaltime` in the Stonescript manual.

***

### time.msbn

> **time.msbn**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:737](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L737)

Unix time represents the number of milliseconds that have elapsed since
1970-01-01T00:00:00Z (January 1, 1970, at 12:00 AM UTC).

#### See

`time.msbn` in the Stonescript manual.

***

### rng

> **rng**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:743](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L743)

Returns a random integer between 0 and 9999.

#### See

`rng` in the Stonescript manual.

***

### rngf

> **rngf**: [`Read`](../wiki/Interface.Read)\<[`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:749](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L749)

Returns a random floating-point number between 0 and 1.

#### See

`rngf` in the Stonescript manual.

***

### screen.i

> **screen.i**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:758](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L758)

The screen's position in-game, as an index that increses when the player
reaches the right-side and it slides over.

#### See

`screen.i` in the Stonescript manual.

***

### screen.x

> **screen.x**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:764](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L764)

The screen's position in-game.

#### See

`screen.x` in the Stonescript manual.

***

### screen.w

> **screen.w**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:770](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L770)

The width of the screen's ASCII grid.

#### See

`screen.w` in the Stonescript manual.

***

### screen.h

> **screen.h**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:776](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L776)

The height of the screen's ASCII grid.

#### See

`screen.h` in the Stonescript manual.

***

### screen.Next

> **screen.Next**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:783](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L783)

For locations that are multi-screen, moves the camera one screen forward
in relation to the player.

#### See

`screen.Next` in the Stonescript manual.

***

### screen.Previous

> **screen.Previous**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:790](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L790)

For locations that are multi-screen, moves the camera one screen back in
relation to the player.

#### See

`screen.Previous` in the Stonescript manual.

***

### screen.ResetOffset

> **screen.ResetOffset**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:791](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L791)

***

### draw.Clear

> **draw.Clear**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:797](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L797)

Clears the entire screen.

#### See

`draw.Clear` in the Stonescript manual.

***

### draw.Player

> **draw.Player**: [`Act`](../wiki/Interface.Act)\<\[\] \| \[`number`, `number`\]\>

Defined in: [src/schema/api.ts:804](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L804)

Draws the player character, with all equipment and addons, at a specific
point in the script.

#### See

`draw.Player` in the Stonescript manual.

***

### draw.Bg

> **draw.Bg**: [`Act`](../wiki/Interface.Act)\<\[`number`, `number`, [`Color`](../wiki/TypeAlias.Color)\] \| \[`number`, `number`, [`Color`](../wiki/TypeAlias.Color), `number`, `number`\]\>

Defined in: [src/schema/api.ts:810](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L810)

Sets the background color at a specific screen position.

#### See

`draw.Bg` in the Stonescript manual.

***

### draw.Box

> **draw.Box**: [`Act`](../wiki/Interface.Act)\<\[`number`, `number`, `number`, `number`, [`Color`](../wiki/TypeAlias.Color), `number`\]\>

Defined in: [src/schema/api.ts:818](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L818)

Draws a rectangular shape at the specified position and size.

#### See

`draw.Box` in the Stonescript manual.

***

### draw.GetSymbol

> **draw.GetSymbol**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], `string`\>

Defined in: [src/schema/api.ts:824](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L824)

Returns the glyph at screen position (x, y).

#### See

`draw.GetSymbol` in the Stonescript manual.

***

### summon.count

> **summon.count**: [`Read`](../wiki/Interface.Read)\<`number`\>

Defined in: [src/schema/api.ts:832](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L832)

The number of summoned allies currently in game.

#### See

`summon.count` in the Stonescript manual.

***

### summon.GetId

> **summon.GetId**: [`Fn`](../wiki/Interface.Fn)\<\[\] \| \[`number`\], `string`\>

Defined in: [src/schema/api.ts:838](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L838)

Returns the ID of the summon at a given index.

#### See

`summon.GetId` in the Stonescript manual.

***

### summon.GetName

> **summon.GetName**: [`Fn`](../wiki/Interface.Fn)\<\[\] \| \[`number`\], `string`\>

Defined in: [src/schema/api.ts:844](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L844)

Returns the localized name of the summon at a given index.

#### See

`summon.GetName` in the Stonescript manual.

***

### summon.GetVar

> **summon.GetVar**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\] \| \[`string`, `number`\], `number`\>

Defined in: [src/schema/api.ts:850](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L850)

Returns the value for a custom variable on a summon.

#### See

`summon.GetVar` in the Stonescript manual.

***

### summon.GetState

> **summon.GetState**: [`Fn`](../wiki/Interface.Fn)\<\[\] \| \[`number`\], `number`\>

Defined in: [src/schema/api.ts:856](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L856)

Returns a number representing the current state of a summon.

#### See

`summon.GetState` in the Stonescript manual.

***

### summon.GetTime

> **summon.GetTime**: [`Fn`](../wiki/Interface.Fn)\<\[\] \| \[`number`\], `number`\>

Defined in: [src/schema/api.ts:862](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L862)

Returns the elapsed number of frames in the current state of a summon.

#### See

`summon.GetTime` in the Stonescript manual.

***

### event.GetObjectiveId

> **event.GetObjectiveId**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `string`\>

Defined in: [src/schema/api.ts:871](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L871)

Returns information about active objectives in a community or seasonal
event.

#### See

`event.GetObjectiveId` in the Stonescript manual.

***

### event.GetObjectiveProgress

> **event.GetObjectiveProgress**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

Defined in: [src/schema/api.ts:875](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L875)

How far the objective at the given index has progressed.

***

### event.GetObjectiveGoal

> **event.GetObjectiveGoal**: [`Fn`](../wiki/Interface.Fn)\<\[`number`\], `number`\>

Defined in: [src/schema/api.ts:879](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L879)

The value the objective at the given index has to reach.

***

### music

> **music**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:887](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L887)

Returns the ID of the currently playing music.

#### See

`music` in the Stonescript manual.

***

### music.Play

> **music.Play**: [`Act`](../wiki/Interface.Act)\<\[[`Loose`](../wiki/TypeAlias.Loose)\<[`MusicId`](../wiki/TypeAlias.MusicId)\>\]\>

Defined in: [src/schema/api.ts:893](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L893)

Plays a music, with the given sound ID.

#### See

`music.Play` in the Stonescript manual.

***

### music.Stop

> **music.Stop**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:894](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L894)

***

### ambient

> **ambient**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:900](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L900)

Returns a comma-separated list of all active ambient audio IDs.

#### See

`ambient` in the Stonescript manual.

***

### ambient.Add

> **ambient.Add**: [`Act`](../wiki/Interface.Act)\<\[[`Loose`](../wiki/TypeAlias.Loose)\<[`AmbientId`](../wiki/TypeAlias.AmbientId)\>\]\>

Defined in: [src/schema/api.ts:906](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L906)

Adds a layer of ambient audio, with the given sound ID.

#### See

`ambient.Add` in the Stonescript manual.

***

### ambient.Stop

> **ambient.Stop**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:912](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L912)

Clears all ambient layers.

#### See

`ambient.Stop` in the Stonescript manual.

***

### color.FromRGB

> **color.FromRGB**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`, `number`\], [`Color`](../wiki/TypeAlias.Color)\>

Defined in: [src/schema/api.ts:920](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L920)

Converts a color from three integer numbers (0 to 255) into a string.

#### See

`color.FromRGB` in the Stonescript manual.

***

### color.ToRGB

> **color.ToRGB**: [`Fn`](../wiki/Interface.Fn)\<\[[`Color`](../wiki/TypeAlias.Color)\], `string`\>

Defined in: [src/schema/api.ts:926](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L926)

Converts a color from string to three integer numbers (0 to 255).

#### See

`color.ToRGB` in the Stonescript manual.

***

### color.Lerp

> **color.Lerp**: [`Fn`](../wiki/Interface.Fn)\<\[[`Color`](../wiki/TypeAlias.Color), [`Color`](../wiki/TypeAlias.Color), `number`\], [`Color`](../wiki/TypeAlias.Color)\>

Defined in: [src/schema/api.ts:930](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L930)

Interpolates linearly between two colours, `t` running from 0 to 1.

***

### color.Random

> **color.Random**: [`Fn`](../wiki/Interface.Fn)\<\[\], [`Color`](../wiki/TypeAlias.Color)\>

Defined in: [src/schema/api.ts:936](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L936)

Returns a random color.

#### See

`color.Random` in the Stonescript manual.

***

### var.get

> **var.get**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], [`StoredValue`](../wiki/TypeAlias.StoredValue)\>

Defined in: [src/schema/api.ts:943](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L943)

Reads a variable from the Stonescript `var` dictionary shared with the
in-game script. A MindConnect accessor rather than a Stonescript member.

***

### var.set

> **var.set**: [`Act`](../wiki/Interface.Act)\<\[`string`, [`Scalar`](../wiki/TypeAlias.Scalar)\]\>

Defined in: [src/schema/api.ts:948](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L948)

Writes a variable into the Stonescript `var` dictionary shared with the
in-game script. A MindConnect accessor rather than a Stonescript member.

***

### var.has

> **var.has**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `boolean`\>

Defined in: [src/schema/api.ts:953](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L953)

Whether the in-game script has a variable of that name. A MindConnect
accessor rather than a Stonescript member.

***

### storage.Get

> **storage.Get**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\] \| \[`string`, [`Scalar`](../wiki/TypeAlias.Scalar)\], [`StoredValue`](../wiki/TypeAlias.StoredValue)\>

Defined in: [src/schema/api.ts:961](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L961)

Retrieves a permanent value stored at the specified key.

#### See

`storage.Get` in the Stonescript manual.

***

### storage.Set

> **storage.Set**: [`Act`](../wiki/Interface.Act)\<\[`string`, [`Scalar`](../wiki/TypeAlias.Scalar)\]\>

Defined in: [src/schema/api.ts:967](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L967)

Saves a value to permanent storage at a specified key.

#### See

`storage.Set` in the Stonescript manual.

***

### storage.Has

> **storage.Has**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `boolean`\>

Defined in: [src/schema/api.ts:971](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L971)

Whether permanent storage holds a value at the specified key.

***

### storage.Delete

> **storage.Delete**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:977](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L977)

Deletes any value that may exist at the specified key.

#### See

`storage.Delete` in the Stonescript manual.

***

### storage.Incr

> **storage.Incr**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\] \| \[`string`, `number`\], `number`\>

Defined in: [src/schema/api.ts:984](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L984)

Increases by 1 the value stored at the specified key, then returns the
new value.

#### See

`storage.Incr` in the Stonescript manual.

***

### storage.Keys

> **storage.Keys**: [`Fn`](../wiki/Interface.Fn)\<\[\], `string`\>

Defined in: [src/schema/api.ts:991](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L991)

Retrieves an array of strings containing all the storage keys available
in the current context.

#### See

`storage.Keys` in the Stonescript manual.

***

### string.Break

> **string.Break**: [`Fn`](../wiki/Interface.Fn)\<\[`string`, `number`\], `string`\>

Defined in: [src/schema/api.ts:999](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L999)

Breaks a string into multiple strings, given a max width.

#### See

`string.Break` in the Stonescript manual.

***

### string.Capitalize

> **string.Capitalize**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

Defined in: [src/schema/api.ts:1005](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1005)

Changes the first letter of a string to be upper-case.

#### See

`string.Capitalize` in the Stonescript manual.

***

### string.Equals

> **string.Equals**: [`Fn`](../wiki/Interface.Fn)\<\[`string`, `string`\], `boolean`\>

Defined in: [src/schema/api.ts:1012](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1012)

Takes two string parameters and returns true if they are exactly the
same.

#### See

`string.Equals` in the Stonescript manual.

***

### string.Format

> **string.Format**: [`Fn`](../wiki/Interface.Fn)\<\[`string`, `...values: Scalar[]`\], `string`\>

Defined in: [src/schema/api.ts:1019](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1019)

Modifies a string by replacing format-templates with the values of the
other parameters, then returns the final composed string.

#### See

`string.Format` in the Stonescript manual.

***

### string.IndexOf

> **string.IndexOf**: [`Fn`](../wiki/Interface.Fn)\<\[`string`, `string`\] \| \[`string`, `string`, `number`\], `number`\>

Defined in: [src/schema/api.ts:1026](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1026)

Takes a string variable and a string criteria as parameters and finds the
position of the criteria inside the string.

#### See

`string.IndexOf` in the Stonescript manual.

***

### string.Size

> **string.Size**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

Defined in: [src/schema/api.ts:1036](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1036)

Takes a string variable as parameter and calculates how long it is, in
number of glyphs.

#### See

`string.Size` in the Stonescript manual.

***

### string.Split

> **string.Split**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\] \| \[`string`, `string`\], `string`\>

Defined in: [src/schema/api.ts:1041](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1041)

Breaks a string into an array of strings on the given separator. Arrives
as one joined string, since the protocol has no array type.

***

### string.Sub

> **string.Sub**: [`Fn`](../wiki/Interface.Fn)\<\[`string`, `number`\] \| \[`string`, `number`, `number`\], `string`\>

Defined in: [src/schema/api.ts:1048](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1048)

Takes a string variable and a starting index as parameters and splits the
string from that point forward.

#### See

`string.Sub` in the Stonescript manual.

***

### string.ToLower

> **string.ToLower**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

Defined in: [src/schema/api.ts:1057](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1057)

Changes all letters in a string to lower-case.

#### See

`string.ToLower` in the Stonescript manual.

***

### string.ToUpper

> **string.ToUpper**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `string`\>

Defined in: [src/schema/api.ts:1063](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1063)

Changes all letters in a string to upper-case.

#### See

`string.ToUpper` in the Stonescript manual.

***

### math.e

> **math.e**: [`Read`](../wiki/Interface.Read)\<[`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1069](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1069)

The constant e, approximately 2.7182818.

***

### math.pi

> **math.pi**: [`Read`](../wiki/Interface.Read)\<[`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1073](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1073)

The constant pi, approximately 3.1415926.

***

### math.Atan2

> **math.Atan2**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1078](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1078)

The angle, in radians, between the x-axis and the line from the origin to
the point (x, y).

***

### math.Clamp

> **math.Clamp**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1084](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1084)

Constrains a number to within the range 'min' and 'max'.

#### See

`math.Clamp` in the Stonescript manual.

***

### math.Lerp

> **math.Lerp**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1088](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1088)

Interpolates linearly from `from` to `to`, `t` running from 0 to 1.

***

### math.Log

> **math.Log**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1094](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1094)

Returns the logarithm of a number at a given base.

#### See

`math.Log` in the Stonescript manual.

***

### math.Max

> **math.Max**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1100](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1100)

Returns the largest of the two numbers.

#### See

`math.Max` in the Stonescript manual.

***

### math.Min

> **math.Min**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1106](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1106)

Returns the smallest of the two numbers.

#### See

`math.Min` in the Stonescript manual.

***

### math.Pow

> **math.Pow**: [`Fn`](../wiki/Interface.Fn)\<\[`number`, `number`\], [`Decimal`](../wiki/TypeAlias.Decimal)\>

Defined in: [src/schema/api.ts:1112](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1112)

Returns the number raised to a power.

#### See

`math.Pow` in the Stonescript manual.

***

### int.Parse

> **int.Parse**: [`Fn`](../wiki/Interface.Fn)\<\[`string`\], `number`\>

Defined in: [src/schema/api.ts:1120](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1120)

Converts a string of a number into an integer value.

#### See

`int.Parse` in the Stonescript manual.

***

### Type

> **Type**: [`Fn`](../wiki/Interface.Fn)\<\[[`Scalar`](../wiki/TypeAlias.Scalar)\], `string`\>

Defined in: [src/schema/api.ts:1126](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1126)

Evaluates the type of a variable and returns a string representation.

#### See

`Type` in the Stonescript manual.

***

### te.language

> **te.language**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:1134](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1134)

The code for the language selected by the player in settings.

#### See

`te.language` in the Stonescript manual.

***

### sys.os

> **sys.os**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:1143](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1143)

The user's operating system, such as "Android", "iOS", "Linux", "OSX" or
"Windows".

#### See

`sys.os` in the Stonescript manual.

***

### sys.isPC

> **sys.isPC**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:1147](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1147)

Whether the game is running on a desktop platform.

***

### sys.isMobile

> **sys.isMobile**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:1151](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1151)

Whether the game is running on a mobile platform.

***

### sys.fileUrl

> **sys.fileUrl**: [`Read`](../wiki/Interface.Read)\<`string`\>

Defined in: [src/schema/api.ts:1157](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1157)

Getter for the current file path to be used when importing scripts.

#### See

`sys.fileUrl` in the Stonescript manual.

***

### sys.cacheRemoteFiles

> **sys.cacheRemoteFiles**: [`Read`](../wiki/Interface.Read)\<`boolean`\>

Defined in: [src/schema/api.ts:1163](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1163)

Indicates if files imported remotely should be cached between runs.

#### See

`sys.cacheRemoteFiles` in the Stonescript manual.

***

### sys.SetFileUrl

> **sys.SetFileUrl**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1167](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1167)

Changes where imported scripts are loaded from.

***

### ui.Clear

> **ui.Clear**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:1173](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1173)

Removes all UI elements from the main container.

#### See

`ui.Clear` in the Stonescript manual.

***

### ui.OpenInv

> **ui.OpenInv**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:1179](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1179)

Opens the inventory screen.

#### See

`ui.OpenInv` in the Stonescript manual.

***

### ui.OpenMind

> **ui.OpenMind**: [`Act`](../wiki/Interface.Act)

Defined in: [src/schema/api.ts:1185](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1185)

Opens the Mind Stone screen.

#### See

`ui.OpenMind` in the Stonescript manual.

***

### ui.ShowBanner

> **ui.ShowBanner**: [`Act`](../wiki/Interface.Act)\<\[`string`\] \| \[`string`, `string`\]\>

Defined in: [src/schema/api.ts:1191](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1191)

Displays the animated banner with up to two messages.

#### See

`ui.ShowBanner` in the Stonescript manual.
