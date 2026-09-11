[ssrpg-bun](../wiki/globals) / Namespace

# Interface: Namespace

Defined in: [src/commands/base.ts:59](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L59)

Typed accessors bound to one StoneScript class, such as `foe` or
`item.left`.

## Remarks

The `int`, `bool` and `str` helpers all read through the per-step cache;
`live` and `invoke` deliberately do not, because they are used for values
the in-game script can change mid-step and for calls with side effects.

## Properties

### className

> `readonly` **className**: `string`

Defined in: [src/commands/base.ts:61](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L61)

The StoneScript class these accessors are bound to, e.g. `foe.buffs`.

## Methods

### member()

> **member**(`name`): `string`

Defined in: [src/commands/base.ts:69](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L69)

Builds the fully qualified name of a member.

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

#### Returns

`string`

For example `foe.hp`, or `foe` when `name` is empty.

***

### raw()

> **raw**(`name`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/base.ts:78](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L78)

Cached read, converted by [autoCast](../wiki/Function.autoCast).

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The converted value.

***

### int()

> **int**(`name`, ...`args`): `Promise`\<`number` \| `null`\>

Defined in: [src/commands/base.ts:87](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L87)

Cached read narrowed to an integer.

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<`number` \| `null`\>

The number, or `null` when the value is absent or not an integer.

***

### bool()

> **bool**(`name`, ...`args`): `Promise`\<`boolean`\>

Defined in: [src/commands/base.ts:96](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L96)

Cached read narrowed to a boolean.

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<`boolean`\>

Whether the game returned `True`.

***

### str()

> **str**(`name`, ...`args`): `Promise`\<`string` \| `null`\>

Defined in: [src/commands/base.ts:105](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L105)

Cached read narrowed to a string.

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<`string` \| `null`\>

The value, or `null` when the game had none.

***

### live()

> **live**(`name`, ...`args`): `Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

Defined in: [src/commands/base.ts:114](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L114)

Uncached read, for values that can change within a single step.

#### Parameters

##### name

`string`

Member name, or `""` for the class itself.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<[`CallValue`](../wiki/TypeAlias.CallValue)\>

The converted value.

***

### invoke()

> **invoke**(`name`, ...`args`): `Promise`\<`void`\>

Defined in: [src/commands/base.ts:123](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L123)

Uncached call of a side-effecting function.

#### Parameters

##### name

`string`

Member name to invoke.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`Promise`\<`void`\>

A promise that settles once the game has acknowledged the call.

***

### queue()

> **queue**(`name`, ...`args`): `void`

Defined in: [src/commands/base.ts:131](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/base.ts#L131)

Queues a side-effecting call for the end of the step.

#### Parameters

##### name

`string`

Member name to invoke.

##### args

...[`Scalar`](../wiki/TypeAlias.Scalar)[]

Arguments to pass to the function.

#### Returns

`void`
