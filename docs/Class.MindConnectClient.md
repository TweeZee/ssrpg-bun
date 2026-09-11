[ssrpg-bun](../wiki/globals) / MindConnectClient

# Class: MindConnectClient

Defined in: [src/client.ts:110](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L110)

One TCP connection to the game: framing, request/response correlation and
step signals.

## Remarks

[SSRPGInterface](../wiki/Class.SSRPGInterface) owns one of these and exposes it as
[SSRPGInterface.client](../wiki/Class.SSRPGInterface#client). Reach for it directly only when you want the
protocol without the caching and stepping on top.

Responses are matched to requests by id, so a stale or out-of-order reply
cannot desynchronise the stream. Because responses are not
length-delimited, the value count of the matching request is what tells the
parser where a frame ends.

## Example

```ts
const client = new MindConnectClient({ port: 64649 });
await client.connect();
const [name] = await client.sendAndReceive([["foe.name"]]);
client.close();
```

## Constructors

### Constructor

> **new MindConnectClient**(`options?`): `MindConnectClient`

Defined in: [src/client.ts:136](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L136)

#### Parameters

##### options?

[`ClientOptions`](../wiki/Interface.ClientOptions) = `{}`

Connection settings; see [ClientOptions](../wiki/Interface.ClientOptions) for the
defaults.

#### Returns

`MindConnectClient`

## Properties

### hostname

> `readonly` **hostname**: `string`

Defined in: [src/client.ts:112](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L112)

Host this client connects to.

***

### port

> `readonly` **port**: `number`

Defined in: [src/client.ts:115](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L115)

TCP port this client connects to.

## Accessors

### connected

#### Get Signature

> **get** **connected**(): `boolean`

Defined in: [src/client.ts:150](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L150)

Whether the socket is open and usable.

##### Remarks

Turns `false` as soon as the connection closes for any reason, including a
protocol error.

##### Returns

`boolean`

## Methods

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [src/client.ts:166](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L166)

Opens the TCP connection to the game.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the socket is open.

#### Remarks

Reconnecting after a close is allowed; buffered data and the failure state
are reset.

#### Throws

[MindConnectError](../wiki/Class.MindConnectError) when a connection is already open.

#### Throws

[ConnectFailedError](../wiki/Class.ConnectFailedError) when the game refuses the connection or
the connect timeout elapses.

***

### close()

> **close**(): `void`

Defined in: [src/client.ts:212](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L212)

Closes the connection and fails everything still in flight.

#### Returns

`void`

#### Remarks

Every pending request and any parked [MindConnectClient.waitForSignal](../wiki/#waitforsignal)
rejects with [ConnectionClosedError](../wiki/Class.ConnectionClosedError). Safe to call more than once.

***

### sendAndReceive()

> **sendAndReceive**(`requests`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

Defined in: [src/client.ts:230](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L230)

Sends a request batch and waits for its response.

#### Parameters

##### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send. An empty batch resolves immediately
without touching the socket.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)[]\>

One value per request, in the order the requests were given.

#### Throws

[ConnectionClosedError](../wiki/Class.ConnectionClosedError) when the connection is not open, or
closes before the response arrives.

#### Throws

[RequestTimeoutError](../wiki/Class.RequestTimeoutError) when the response does not arrive
within [ClientOptions.requestTimeoutMs](../wiki/Interface.SSRPGInterfaceOptions#requesttimeoutms).

#### Throws

[ProtocolError](../wiki/Class.ProtocolError) when the request batch is malformed.

***

### sendRequest()

> **sendRequest**(`requests`): `number`

Defined in: [src/client.ts:274](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L274)

Sends a request batch without waiting for the response.

#### Parameters

##### requests

readonly [`Request`](../wiki/TypeAlias.Request)[]

The batch to send.

#### Returns

`number`

The request id the batch was tagged with.

#### Remarks

Nothing correlates the reply, so the response frame cannot be parsed and
will surface as a [ProtocolError](../wiki/Class.ProtocolError). Use
[MindConnectClient.sendAndReceive](../wiki/#sendandreceive) unless you are implementing your
own correlation on top.

#### Throws

[ConnectionClosedError](../wiki/Class.ConnectionClosedError) when the connection is not open.

***

### waitForSignal()

> **waitForSignal**(): `Promise`\<[`StepSignal`](../wiki/Interface.StepSignal)\>

Defined in: [src/client.ts:294](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L294)

Waits for the next step signal from the game.

#### Returns

`Promise`\<[`StepSignal`](../wiki/Interface.StepSignal)\>

The next signal, or a buffered one if the game is ahead.

#### Remarks

Signals that arrive before this is called are buffered, so no frame is
missed while your step callback is running. There is no timeout: a paused
game simply produces no frames.

#### Throws

[ConnectionClosedError](../wiki/Class.ConnectionClosedError) when the connection is not open, or
closes while waiting.

#### Throws

[MindConnectError](../wiki/Class.MindConnectError) when another caller is already waiting.

***

### sendEof()

> **sendEof**(): `void`

Defined in: [src/client.ts:315](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L315)

Tells the game that our step is done and it may resume.

#### Returns

`void`

#### Remarks

Failures are swallowed: a closed connection is reported through the
pending request or signal waiter instead.
