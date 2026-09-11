[ssrpg-bun](../wiki/globals) / createDebuffs

# Function: createDebuffs()

> **createDebuffs**(`host`, `className?`): [`Buffs`](../wiki/Interface.Buffs)

Defined in: [src/commands/debuffs.ts:26](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/debuffs.ts#L26)

Builds a [Debuffs](../wiki/TypeAlias.Debuffs) namespace.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className?

`string` = `"debuffs"`

StoneScript class to bind to. Defaults to `debuffs`.

## Returns

[`Buffs`](../wiki/Interface.Buffs)

Accessors for that collection.
