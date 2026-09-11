[ssrpg-bun](../wiki/globals) / SSRPGInterfaceOptions

# Interface: SSRPGInterfaceOptions

Defined in: [src/interface.ts:55](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L55)

Options for [SSRPGInterface](../wiki/Class.SSRPGInterface).

## Remarks

Extends [ClientOptions](../wiki/Interface.ClientOptions), so `hostname`, `port` and the two timeouts
can be set here too.

## Extends

- [`ClientOptions`](../wiki/Interface.ClientOptions)

## Properties

### hostname?

> `optional` **hostname?**: `string`

Defined in: [src/client.ts:30](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L30)

Host the game listens on.

#### Default Value

`"127.0.0.1"`

#### Inherited from

[`ClientOptions`](../wiki/Interface.ClientOptions).[`hostname`](../wiki/Interface.ClientOptions#hostname)

***

### port?

> `optional` **port?**: `number`

Defined in: [src/client.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L37)

TCP port the game's MindConnect server listens on.

#### Default Value

`64649`

#### Inherited from

[`ClientOptions`](../wiki/Interface.ClientOptions).[`port`](../wiki/Interface.ClientOptions#port)

***

### connectTimeoutMs?

> `optional` **connectTimeoutMs?**: `number`

Defined in: [src/client.ts:45](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L45)

How long to wait for the TCP connection, in milliseconds. `0` waits
indefinitely.

#### Default Value

`10_000`

#### Inherited from

[`ClientOptions`](../wiki/Interface.ClientOptions).[`connectTimeoutMs`](../wiki/Interface.ClientOptions#connecttimeoutms)

***

### requestTimeoutMs?

> `optional` **requestTimeoutMs?**: `number`

Defined in: [src/client.ts:58](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L58)

How long to wait for a response, in milliseconds. `0` disables the
timeout.

#### Remarks

This does not apply to [MindConnectClient.waitForSignal](../wiki/Class.MindConnectClient#waitforsignal), which
waits indefinitely — a paused or backgrounded game can go a long time
without producing a frame.

#### Default Value

`10_000`

#### Inherited from

[`ClientOptions`](../wiki/Interface.ClientOptions).[`requestTimeoutMs`](../wiki/Interface.ClientOptions#requesttimeoutms)

***

### mode?

> `optional` **mode?**: [`Mode`](../wiki/TypeAlias.Mode)

Defined in: [src/interface.ts:62](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L62)

Operation mode. Must match the `//MindConnect: [mode]` header on the first
line of the in-game Stonescript.

#### Default Value

`"sync"`

***

### warnOnVersionMismatch?

> `optional` **warnOnVersionMismatch?**: `boolean`

Defined in: [src/interface.ts:73](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L73)

Log a warning when the game reports a protocol version other than
[PROTOCOL\_VERSION](../wiki/Variable.PROTOCOL_VERSION).

#### Remarks

Logged at most once per session, not once per frame.

#### Default Value

`true`
