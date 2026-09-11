[ssrpg-bun](../wiki/globals) / autoCast

# Function: autoCast()

> **autoCast**(`raw`): [`CallValue`](../wiki/TypeAlias.CallValue)

Defined in: [src/protocol.ts:141](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L141)

Converts a raw wire value to the closest JavaScript type.

## Parameters

### raw

`string` \| `null`

The field as received, or `null` for a missing value.

## Returns

[`CallValue`](../wiki/TypeAlias.CallValue)

The converted value, or `null` when `raw` was `null`.

## Remarks

The protocol is untyped, so values are converted by shape:

- `"True"` and `"False"` become booleans.
- Integer literals become numbers, unless they exceed
  `Number.MAX_SAFE_INTEGER`, in which case they stay strings so no precision
  is lost.
- Everything else — including decimals such as `"3.5"` — stays a string.
