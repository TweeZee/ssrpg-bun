[ssrpg-bun](../wiki/globals) / AI

# Interface: AI

Defined in: [src/commands/ai.ts:15](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/ai.ts#L15)

`ai` — state of the in-game auto-pilot.

## Remarks

Useful in `sync` mode to tell whether the in-game script is currently
driving the character, so your script can stay out of its way.

## Methods

### enabled()

> **enabled**(): `Promise`\<`boolean`\>

Defined in: [src/commands/ai.ts:21](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/ai.ts#L21)

Reads `ai.enabled`.

#### Returns

`Promise`\<`boolean`\>

Whether the auto-pilot is switched on.

***

### paused()

> **paused**(): `Promise`\<`boolean`\>

Defined in: [src/commands/ai.ts:28](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/ai.ts#L28)

Reads `ai.paused`.

#### Returns

`Promise`\<`boolean`\>

Whether the auto-pilot is paused.

***

### idle()

> **idle**(): `Promise`\<`boolean`\>

Defined in: [src/commands/ai.ts:35](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/ai.ts#L35)

Reads `ai.idle`.

#### Returns

`Promise`\<`boolean`\>

Whether the auto-pilot currently has nothing to do.

***

### walking()

> **walking**(): `Promise`\<`boolean`\>

Defined in: [src/commands/ai.ts:42](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/ai.ts#L42)

Reads `ai.walking`.

#### Returns

`Promise`\<`boolean`\>

Whether the auto-pilot is walking.
