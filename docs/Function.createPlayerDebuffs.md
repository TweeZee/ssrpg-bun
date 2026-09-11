[ssrpg-bun](../wiki/globals) / createPlayerDebuffs

# Function: createPlayerDebuffs()

> **createPlayerDebuffs**(`host`, `className?`): [`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Defined in: [src/commands/debuffs.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/debuffs.ts#L37)

Builds a [PlayerDebuffs](../wiki/TypeAlias.PlayerDebuffs) namespace.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className?

`string` = `"debuffs"`

StoneScript class to bind to. Defaults to `debuffs`.

## Returns

[`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Accessors for the player's debuffs.
