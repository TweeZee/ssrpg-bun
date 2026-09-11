[ssrpg-bun](../wiki/globals) / Encounter

# Interface: Encounter

Defined in: [src/commands/encounter.ts:11](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/encounter.ts#L11)

`encounter` — information about the encounter in progress.

## Methods

### isElite()

> **isElite**(): `Promise`\<`boolean`\>

Defined in: [src/commands/encounter.ts:17](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/encounter.ts#L17)

Reads `encounter.isElite`.

#### Returns

`Promise`\<`boolean`\>

Whether this is an elite encounter.

***

### eliteMod()

> **eliteMod**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/encounter.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/encounter.ts#L24)

Reads `encounter.eliteMod`.

#### Returns

`Promise`\<`string` \| `null`\>

Id of the elite modifier, or `null` outside an elite encounter.
