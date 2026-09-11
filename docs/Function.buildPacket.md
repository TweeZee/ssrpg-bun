[ssrpg-bun](../wiki/globals) / buildPacket

# Function: buildPacket()

> **buildPacket**(`requestId`, `requests`): `string`

Defined in: [src/protocol.ts:92](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L92)

Serializes one request batch into a wire packet.

## Parameters

### requestId

`number`

Id the response will be tagged with. Callers should keep
ids unique among the requests currently in flight.

### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send; must not contain empty requests.

## Returns

`string`

The packet, ready to be encoded as UTF-8 and written to the socket.

## Throws

[ProtocolError](../wiki/Class.ProtocolError) if a request is not a non-empty array.

## Example

```ts
buildPacket(1, [["draw.GetSymbol", 10, 5]]);
// "1␟1␟2␟draw.GetSymbol␟i␟10␟i␟5"
```
