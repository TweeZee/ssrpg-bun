[ssrpg-bun](../wiki/globals) / Request

# Type Alias: Request

> **Request** = readonly \[`string`, [`Scalar`](../wiki/TypeAlias.Scalar)[]\]

Defined in: [src/types.ts:70](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L70)

A single request: a variable or function name followed by its arguments.

## Example

```ts
const requests: Request[] = [
  ["foe.name"],                 // read a variable
  ["draw.GetSymbol", 10, 5],    // call a function
  ["brew", "tar+wood"],         // queue a command
];
```
