[ssrpg-bun](../wiki/globals) / Scalar

# Type Alias: Scalar

> **Scalar** = `string` \| `number` \| `boolean`

Defined in: [src/types.ts:45](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L45)

A value that can be sent as an argument of a call or a command.

## Remarks

Integers are transmitted as StoneScript integers. Non-integer numbers and
booleans have no native representation in the protocol: booleans are sent as
`1`/`0` and non-integer numbers are stringified.
