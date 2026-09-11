[ssrpg-bun](../wiki/globals) / Head

# Interface: Head()

Defined in: [src/commands/item.ts:16](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L16)

One equipped item, as exposed by `item.left` and `item.right`.

## Remarks

Call the namespace itself to read the item's name, mirroring StoneScript,
where `item.left` is both a variable and a class.

> **Head**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/item.ts:22](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L22)

Reads the item's display name.

## Returns

`Promise`\<`string` \| `null`\>

The name, or `null` when the hand is empty.

## Methods

### id()

> **id**(): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/item.ts:29](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L29)

Reads `id`.

#### Returns

`Promise`\<`string` \| `null`\>

The item's internal id, which is stable across languages.

***

### state()

> **state**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L37)

Reads `state`.

#### Returns

`Promise`\<`number` \| `null`\>

The item's state code; see the StoneScript documentation for what
each value means.

***

### time()

> **time**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:44](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L44)

Reads `time`.

#### Returns

`Promise`\<`number` \| `null`\>

How long the item has been in its current state, in frames.

***

### gp()

> **gp**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/item.ts:51](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L51)

Reads `gp`.

#### Returns

`Promise`\<`number` \| `null`\>

The item's value in gold pieces.
