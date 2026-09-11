[ssrpg-bun](../wiki/globals) / createBuffs

# Function: createBuffs()

> **createBuffs**(`host`, `className?`): [`Buffs`](../wiki/Interface.Buffs)

Defined in: [src/commands/buffs.ts:63](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/buffs.ts#L63)

Builds a [Buffs](../wiki/Interface.Buffs) namespace.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className?

`string` = `"buffs"`

StoneScript class to bind to. Defaults to `buffs`; pass
`"foe.buffs"` or `"foe.debuffs"` for a foe's collections.

## Returns

[`Buffs`](../wiki/Interface.Buffs)

Accessors for that collection.
