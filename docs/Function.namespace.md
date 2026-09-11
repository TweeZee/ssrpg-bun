[ssrpg-bun](../wiki/globals) / namespace

# Function: namespace()

> **namespace**(`host`, `className`): [`Namespace`](../wiki/Interface.Namespace)

Defined in: [src/commands/base.ts:149](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L149)

Creates the accessors for one StoneScript class.

## Parameters

### host

[`CallHost`](../wiki/Interface.CallHost)

The interface the calls are routed through.

### className

`string`

StoneScript class name, e.g. `foe` or `item.left`. Pass
`""` to address top-level variables.

## Returns

[`Namespace`](../wiki/Interface.Namespace)

Accessors bound to `className`.

## Example

```ts
const ns = namespace(ssrpg, "foe");
await ns.int("hp");           // reads foe.hp
await ns.str("");             // reads foe itself
```
