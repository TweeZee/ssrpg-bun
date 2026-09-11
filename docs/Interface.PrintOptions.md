[ssrpg-bun](../wiki/globals) / PrintOptions

# Interface: PrintOptions

Defined in: [src/commands/command.ts:42](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L42)

Positioning and styling options for [CommandQueue.print](../wiki/Class.CommandQueue#print).

## Remarks

The anchors [face](../wiki/#face), `player`, `head`, `foe` and
`center` are mutually exclusive and are applied in that order of precedence.
Without any of them the coordinates are absolute screen coordinates.

## Properties

### x?

> `optional` **x?**: `number`

Defined in: [src/commands/command.ts:44](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L44)

Column. Only used together with [PrintOptions.y](../wiki/#y).

***

### y?

> `optional` **y?**: `number`

Defined in: [src/commands/command.ts:46](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L46)

Row. Only used together with [PrintOptions.x](../wiki/#x).

***

### color?

> `optional` **color?**: [`Color`](../wiki/TypeAlias.Color)

Defined in: [src/commands/command.ts:53](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L53)

Colour of the text: `#rrggbb`, or a preset such as `#red`.

#### Remarks

Only applied when both `x` and `y` are given.

***

### face?

> `optional` **face?**: `boolean`

Defined in: [src/commands/command.ts:60](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L60)

Draw on the player's face instead of on the screen.

#### Remarks

Overrides every positioning option, including `x` and `y`.

***

### player?

> `optional` **player?**: `boolean`

Defined in: [src/commands/command.ts:62](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L62)

Treat the coordinates as relative to the player.

***

### head?

> `optional` **head?**: `boolean`

Defined in: [src/commands/command.ts:64](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L64)

Treat the coordinates as relative to the player's head.

***

### foe?

> `optional` **foe?**: `boolean`

Defined in: [src/commands/command.ts:66](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L66)

Treat the coordinates as relative to the current foe.

***

### center?

> `optional` **center?**: `boolean`

Defined in: [src/commands/command.ts:68](https://github.com/TweeZee/ssrpg-bun/blob/main/src/commands/command.ts#L68)

Treat the coordinates as relative to the centre of the screen.
