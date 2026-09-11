[ssrpg-bun](../wiki/globals) / Armor

# Interface: Armor()

Defined in: [src/commands/armor.ts:21](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/armor.ts#L21)

`armor` — the player's armour.

## Remarks

Call the namespace itself to read the current value, mirroring StoneScript,
where `armor` is both a variable and a class.

## Example

```ts
const points = await ssrpg.armor();
const percent = await ssrpg.armor.f();
```

> **Armor**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/armor.ts:27](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/armor.ts#L27)

Reads `armor`.

## Returns

`Promise`\<`number` \| `null`\>

Current armour points, or `null` when the player has no armour.

## Methods

### f()

> **f**(): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/armor.ts:34](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/armor.ts#L34)

Reads `armor.f`.

#### Returns

`Promise`\<`number` \| `null`\>

Armour as a fraction of the maximum, in percent.
