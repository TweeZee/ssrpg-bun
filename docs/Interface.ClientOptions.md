[ssrpg-bun](../wiki/globals) / ClientOptions

# Interface: ClientOptions

Defined in: [src/client.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L24)

Connection settings for [MindConnectClient](../wiki/Class.MindConnectClient).

## Remarks

[SSRPGInterfaceOptions](../wiki/Interface.SSRPGInterfaceOptions) extends this, so the same settings can be
passed straight to [SSRPGInterface](../wiki/Class.SSRPGInterface).

## Extended by

- [`SSRPGInterfaceOptions`](../wiki/Interface.SSRPGInterfaceOptions)

## Properties

### hostname?

> `optional` **hostname?**: `string`

Defined in: [src/client.ts:30](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L30)

Host the game listens on.

#### Default Value

`"127.0.0.1"`

***

### port?

> `optional` **port?**: `number`

Defined in: [src/client.ts:37](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L37)

TCP port the game's MindConnect server listens on.

#### Default Value

`64649`

***

### connectTimeoutMs?

> `optional` **connectTimeoutMs?**: `number`

Defined in: [src/client.ts:45](https://github.com/TweeZee/ssrpg-bun/blob/main/src/client.ts#L45)

How long to wait for the TCP connection, in milliseconds. `0` waits
indefinitely.

#### Default Value

`10_000`

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
