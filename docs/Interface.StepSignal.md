[ssrpg-bun](../wiki/globals) / StepSignal

# Interface: StepSignal

Defined in: [src/types.ts:77](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L77)

A step signal received from the game, marking the start of a step.

## See

[MindConnectClient.waitForSignal](../wiki/Class.MindConnectClient#waitforsignal)

## Properties

### context

> **context**: [`StepContext`](../wiki/TypeAlias.StepContext)

Defined in: [src/types.ts:79](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L79)

The half of the frame this step belongs to.

***

### version

> **version**: `string`

Defined in: [src/types.ts:85](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L85)

Protocol version the game reports, for example `"0.3"`.

#### See

[PROTOCOL\_VERSION](../wiki/Variable.PROTOCOL_VERSION) for the version this library speaks.
