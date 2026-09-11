[ssrpg-bun](../wiki/globals) / parseSignal

# Function: parseSignal()

> **parseSignal**(`buffer`): [`ParsedSignal`](../wiki/Interface.ParsedSignal) \| `null`

Defined in: [src/protocol.ts:209](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L209)

Parses a step signal at the start of a receive buffer.

## Parameters

### buffer

`string`

Buffered text beginning with [SIGNAL](../wiki/Variable.SIGNAL).

## Returns

[`ParsedSignal`](../wiki/Interface.ParsedSignal) \| `null`

The signal plus the number of characters it consumed, or `null`
when `buffer` does not yet hold a complete signal.

## Example

```ts
parseSignal("\x06pre0.3");
// { signal: { context: "pre", version: "0.3" }, consumed: 7 }
```
