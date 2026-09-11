[ssrpg-bun](../wiki/globals) / ParsedSignal

# Interface: ParsedSignal

Defined in: [src/protocol.ts:189](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L189)

The outcome of a successful [parseSignal](../wiki/Function.parseSignal) call.

## Properties

### signal

> **signal**: [`StepSignal`](../wiki/Interface.StepSignal)

Defined in: [src/protocol.ts:191](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L191)

The signal that was read.

***

### consumed

> **consumed**: `number`

Defined in: [src/protocol.ts:193](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L193)

How many characters of the buffer the signal occupied.
