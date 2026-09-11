[ssrpg-bun](../wiki/globals) / createHead

# Function: createHead()

> **createHead**(`host`, `className`): [`Head`](../wiki/Interface.Head)

Defined in: [src/commands/item.ts:142](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/item.ts#L142)

Builds a [Head](../wiki/Interface.Head) namespace for one hand.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className

`string`

StoneScript class to bind to, e.g. `item.left`.

## Returns

[`Head`](../wiki/Interface.Head)

Accessors for that hand.
