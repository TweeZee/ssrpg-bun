[ssrpg-bun](../wiki/globals) / StoneScriptCommands

# Interface: StoneScriptCommands

Defined in: [src/schema/api.ts:1267](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1267)

The commands that are queued during a step and flushed as one batch.

## Remarks

Each carries a single pre-joined payload, which is what the wire format
expects. [CommandQueue](../wiki/Class.CommandQueue) builds those payloads for you.

## Properties

### \>

> **\>**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1268](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1268)

***

### play

> **play**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1274](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1274)

Plays a sound effect with an optional pitch value.

#### See

`play` in the Stonescript manual.

***

### equip

> **equip**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1279](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1279)

Equips an item to whichever hand fits best, from up to 7 search criteria.
Two-handed items must use this form.

***

### equipL

> **equipL**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1285](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1285)

Equips an item to the left hand that best fits the given criteria.

#### See

`equipL` in the Stonescript manual.

***

### equipR

> **equipR**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1291](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1291)

Equips an item to the right hand that best fits the given criteria.

#### See

`equipR` in the Stonescript manual.

***

### loadout

> **loadout**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1297](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1297)

Equips a specific loadout number.

#### See

`loadout` in the Stonescript manual.

***

### activate

> **activate**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1303](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1303)

Activates an item ability.

#### See

`activate` in the Stonescript manual.

***

### enable

> **enable**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1307](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1307)

Restores a game feature that was turned off with `disable`.

***

### disable

> **disable**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1311](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1311)

Turns a game feature off.

***

### brew

> **brew**: [`Act`](../wiki/Interface.Act)\<\[`string`\]\>

Defined in: [src/schema/api.ts:1317](https://github.com/TweeZee/ssrpg-bun/blob/main/src/schema/api.ts#L1317)

Refills the potion bottle to the specified combination of ingredients.

#### See

`brew` in the Stonescript manual.
