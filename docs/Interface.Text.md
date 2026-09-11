[ssrpg-bun](../wiki/globals) / Text

# Interface: Text

Defined in: [src/commands/te.ts:18](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/te.ts#L18)

**`Experimental`**

`te` — text and localisation helpers.

## Remarks

Useful for matching on names in a language-independent way, though reading
an `id` member such as [Foe.id](../wiki/Interface.Foe#id) is usually simpler.

 The Python reference implementation left this class disabled,
so the game may not expose it over MindConnect yet.

## Methods

### language()

> **language**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/te.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/te.ts#L24)

**`Experimental`**

Reads `te.language`.

#### Returns

`Promise`\<`string` \| `null`\>

The active language code.

***

### xt()

> **xt**(`text`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/te.ts:32](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/te.ts#L32)

**`Experimental`**

Calls `te.xt` — translates a text id into the active language.

#### Parameters

##### text

`string`

Text id to translate.

#### Returns

`Promise`\<`string` \| `null`\>

The translated string.

***

### GetTID()

> **GetTID**(`text`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/te.ts:40](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/te.ts#L40)

**`Experimental`**

Calls `te.GetTID`.

#### Parameters

##### text

`string`

A translated string.

#### Returns

`Promise`\<`string` \| `null`\>

The text id it came from.

***

### ToEnglish()

> **ToEnglish**(`text`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/te.ts:48](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/te.ts#L48)

**`Experimental`**

Calls `te.ToEnglish`.

#### Parameters

##### text

`string`

A localised string.

#### Returns

`Promise`\<`string` \| `null`\>

The English equivalent.
