[ssrpg-bun](../wiki/globals) / CallHost

# Interface: CallHost

Defined in: [src/commands/base.ts:22](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L22)

The subset of [SSRPGInterface](../wiki/Class.SSRPGInterface) the namespace wrappers depend on.

## Remarks

Declared as an interface so namespaces can be built against a stub in tests
without a live connection.

## Methods

### call()

> **call**(`command`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/base.ts:30](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L30)

Reads a variable or calls a function, memoised for the current step.

#### Parameters

##### command

`string`

Fully qualified StoneScript name, e.g. `foe.hp`.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The converted result.

***

### callUncached()

> **callUncached**(`command`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/base.ts:39](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L39)

Reads a variable or calls a function, bypassing the cache.

#### Parameters

##### command

`string`

Fully qualified StoneScript name, e.g. `var.get`.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The converted result.

***

### queue()

> **queue**(`command`, ...`args`): `void`

Defined in: [src/commands/base.ts:47](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L47)

Queues a request to be sent when the current step ends.

#### Parameters

##### command

`string`

Fully qualified StoneScript name, e.g. `loc.Pause`.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass along.

#### Returns

`void`
