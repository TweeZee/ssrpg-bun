[ssrpg-bun](../wiki/globals) / createPlayerBuffs

# Function: createPlayerBuffs()

> **createPlayerBuffs**(`host`, `className?`): [`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Defined in: [src/commands/buffs.ts:80](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L80)

Builds a [PlayerBuffs](../wiki/Interface.PlayerBuffs) namespace.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className?

`string` = `"buffs"`

StoneScript class to bind to. Defaults to `buffs`.

## Returns

[`PlayerBuffs`](../wiki/Interface.PlayerBuffs)

Accessors for the player's buffs.
