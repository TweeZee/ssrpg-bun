[ssrpg-bun](../wiki/globals) / StepFunction

# Type Alias: StepFunction

> **StepFunction** = (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [src/interface.ts:88](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L88)

A step callback: your script's logic for one half of a game frame.

## Parameters

### context

[`StepContext`](../wiki/TypeAlias.StepContext)

Which half of the frame this call is for.

## Returns

`void` \| `Promise`\<`void`\>

Nothing, or a promise to await before the queued commands are
flushed.

## Remarks

Receives `pre` and `post` in `sync` mode and `exclusive` in `exclusive`
mode. It may be `async`; the game stays paused until it settles, so keep it
short.
