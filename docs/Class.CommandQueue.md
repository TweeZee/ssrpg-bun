[ssrpg-bun](../wiki/globals) / CommandQueue

# Class: CommandQueue

Defined in: [src/commands/command.ts:103](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L103)

Collects StoneScript commands during a step and sends them in one batch.

## Remarks

You rarely need to construct this yourself: [SSRPGInterface](../wiki/Class.SSRPGInterface) owns one
as [SSRPGInterface.command](../wiki/Class.SSRPGInterface#command) and mirrors every method on itself, so
`ssrpg.brew("tar", "wood")` and `ssrpg.command.brew("tar", "wood")` are
equivalent. [SSRPGInterface.step](../wiki/Class.SSRPGInterface#step) clears the queue before the callback
runs and flushes it afterwards.

## Example

```ts
await ssrpg.step(() => {
  ssrpg.print("hello", { x: 1, y: 1 });
  ssrpg.equipR("sword");
}); // both commands leave in one packet here
```

## Constructors

### Constructor

> **new CommandQueue**(`host`): `CommandQueue`

Defined in: [src/commands/command.ts:111](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L111)

#### Parameters

##### host

[`CommandFlusher`](../wiki/Interface.CommandFlusher)

Used to send the batch when [CommandQueue.run](../wiki/#run) is
called.

#### Returns

`CommandQueue`

## Accessors

### pending

#### Get Signature

> **get** **pending**(): readonly [`Request`](../wiki/TypeAlias.Request)[]

Defined in: [src/commands/command.ts:116](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L116)

The commands queued so far in this step, in insertion order.

##### Returns

readonly [`Request`](../wiki/TypeAlias.Request)[]

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/commands/command.ts:121](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L121)

Discards every queued command without sending it.

#### Returns

`void`

***

### run()

> **run**(): `Promise`\<`void`\>

Defined in: [src/commands/command.ts:135](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L135)

Sends every queued command in one batch and empties the queue.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the batch.
Resolves immediately when nothing is queued.

#### Remarks

The queue is emptied before the request is awaited, so a failed flush does
not resend the same commands on the next step.

***

### push()

> **push**\<`N`\>(`name`, ...`args`): `void`

Defined in: [src/commands/command.ts:160](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L160)

Queues a request by name, checked against the StoneScript API.

#### Type Parameters

##### N

`N` *extends* [`QueueName`](../wiki/TypeAlias.QueueName)

The member or command name.

#### Parameters

##### name

`N`

StoneScript command or function name.

##### args

...[`QueueArgsOf`](../wiki/TypeAlias.QueueArgsOf)\<`N`\>

Arguments for that name.

#### Returns

`void`

#### Remarks

Accepts both the ten queued commands and any callable member, since the
queue is just a deferred batch. The typed methods below are usually more
convenient, because they build the joined payload for you.

#### Example

```ts
ssrpg.command.push("loc.Pause");
ssrpg.command.push("player.ShowScaredFace", 30);
```

***

### pushRaw()

> **pushRaw**(`name`, ...`args`): `void`

Defined in: [src/commands/command.ts:173](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L173)

Queues a request without checking the name.

#### Parameters

##### name

`string`

StoneScript command or function name.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments, already in the shape the game expects.

#### Returns

`void`

#### Remarks

The escape hatch for a command this library does not know yet.

***

### print()

> **print**(`text`, `options?`): `void`

Defined in: [src/commands/command.ts:191](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L191)

Queues `>` — prints text to the screen.

#### Parameters

##### text

[`PrintArg`](../wiki/TypeAlias.PrintArg) \| readonly [`PrintArg`](../wiki/TypeAlias.PrintArg)[]

What to print. An array is concatenated without a separator,
which is how you interpolate several values into one line.

##### options?

[`PrintOptions`](../wiki/Interface.PrintOptions) = `{}`

Where and how to draw it.

#### Returns

`void`

#### Example

```ts
ssrpg.print("hp low!", { x: 1, y: 1, color: "r" });
ssrpg.print("!", { x: 0, y: -1, foe: true });      // above the foe
ssrpg.print(["hp: ", 42]);                          // "hp: 42"
```

***

### play()

> **play**(`sound`, `pitch?`): `void`

Defined in: [src/commands/command.ts:222](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L222)

Queues `play` — plays a sound effect.

#### Parameters

##### sound

[`Loose`](../wiki/TypeAlias.Loose)\<[`SoundId`](../wiki/TypeAlias.SoundId)\>

Sound id. The documented ids autocomplete; others are
still accepted.

##### pitch?

`number`

Playback pitch. `100` is unchanged, higher is faster.

#### Returns

`void`

#### See

Appendix B of the Stonescript manual for the full list.

#### Example

```ts
ssrpg.play("bat_wing");
ssrpg.play("ant_attack", 120);
```

***

### equipR()

> **equipR**(...`criteria`): `void`

Defined in: [src/commands/command.ts:233](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L233)

Queues `equipR` — equips an item to the right hand.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria, joined with spaces: name fragments,
[SearchFilter](../wiki/TypeAlias.SearchFilter) tags, `*n` star levels, `+n` enchantment bonuses, or
any of those negated with `-`. Up to 7.

#### Returns

`void`

***

### equipL()

> **equipL**(...`criteria`): `void`

Defined in: [src/commands/command.ts:244](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L244)

Queues `equipL` — equips an item to the left hand.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria, joined with spaces: name fragments,
[SearchFilter](../wiki/TypeAlias.SearchFilter) tags, `*n` star levels, `+n` enchantment bonuses, or
any of those negated with `-`. Up to 7.

#### Returns

`void`

***

### equip()

> **equip**(...`criteria`): `void`

Defined in: [src/commands/command.ts:264](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L264)

Queues `equip` — equips an item to whichever hand fits best.

#### Parameters

##### criteria

...[`ItemCriteria`](../wiki/TypeAlias.ItemCriteria)[]

Search criteria, joined with spaces: name fragments,
[SearchFilter](../wiki/TypeAlias.SearchFilter) tags, `*n` star levels, `+n` enchantment bonuses, or
any of those negated with `-`. Up to 7.

#### Returns

`void`

#### Remarks

Two-handed items must be equipped with this form rather than with
[CommandQueue.equipL](../wiki/#equipl) or [CommandQueue.equipR](../wiki/#equipr).

#### Example

```ts
ssrpg.equip("hammer", "*7", "-socket");
```

***

### loadout()

> **loadout**(`index`): `void`

Defined in: [src/commands/command.ts:273](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L273)

Queues `loadout` — switches to a saved loadout.

#### Parameters

##### index

`number`

The loadout slot to switch to.

#### Returns

`void`

***

### activate()

> **activate**(`target`): `void`

Defined in: [src/commands/command.ts:290](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L290)

Queues `activate` — activates an item ability.

#### Parameters

##### target

[`ActivateTarget`](../wiki/TypeAlias.ActivateTarget)

A hand (`"R"`/`"right"`, `"L"`/`"left"`), the potion
(`"P"`/`"potion"`), or an [AbilityId](../wiki/TypeAlias.AbilityId).

#### Returns

`void`

#### See

[Item.CanActivate](../wiki/Interface.Item#canactivate) to check first.

#### Example

```ts
if (await ssrpg.item.CanActivate("skeleton_arm")) ssrpg.activate("R");
```

***

### enable()

#### Call Signature

> **enable**(`feature`): `void`

Defined in: [src/commands/command.ts:302](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L302)

Queues `enable` — restores a game feature.

##### Parameters

###### feature

[`ToggleFeature`](../wiki/TypeAlias.ToggleFeature)

The feature to restore, or `hud` followed by the flags
of the elements to bring back.

##### Returns

`void`

##### See

[CommandQueue.disable](../wiki/#disable)

#### Call Signature

> **enable**\<`F`\>(`hud`): `void`

Defined in: [src/commands/command.ts:303](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L303)

Queues `enable` — restores a game feature.

##### Type Parameters

###### F

`F` *extends* `string`

##### Parameters

###### hud

`` `hud ${HudOpts<F>}` ``

##### Returns

`void`

##### See

[CommandQueue.disable](../wiki/#disable)

***

### disable()

#### Call Signature

> **disable**(`feature`): `void`

Defined in: [src/commands/command.ts:324](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L324)

Queues `disable` — turns a game feature off.

##### Parameters

###### feature

[`ToggleFeature`](../wiki/TypeAlias.ToggleFeature)

The feature to disable, or `hud` followed by flags.

##### Returns

`void`

##### Remarks

`hud` on its own hides every element; adding flags hides only those —
`p` player health, `f` foe health, `a` ability buttons, `r` resources,
`b` banner, `u` utility belt. Invalid flag letters are a compile error.

##### Example

```ts
ssrpg.disable("abilities");
ssrpg.disable("hud ru");   // resources and utility belt only
```

#### Call Signature

> **disable**\<`F`\>(`hud`): `void`

Defined in: [src/commands/command.ts:325](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L325)

Queues `disable` — turns a game feature off.

##### Type Parameters

###### F

`F` *extends* `string`

##### Parameters

###### hud

`` `hud ${HudOpts<F>}` ``

##### Returns

`void`

##### Remarks

`hud` on its own hides every element; adding flags hides only those —
`p` player health, `f` foe health, `a` ability buttons, `r` resources,
`b` banner, `u` utility belt. Invalid flag letters are a compile error.

##### Example

```ts
ssrpg.disable("abilities");
ssrpg.disable("hud ru");   // resources and utility belt only
```

***

### brew()

> **brew**(...`materials`): `void`

Defined in: [src/commands/command.ts:340](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L340)

Queues `brew` — brews a potion from the given materials.

#### Parameters

##### materials

...`string`[]

Material names, joined with `+` as the game expects.

#### Returns

`void`

#### Example

```ts
ssrpg.brew("tar", "wood"); // sends "tar+wood"
```
