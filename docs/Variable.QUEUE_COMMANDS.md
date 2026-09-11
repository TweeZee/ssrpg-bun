[ssrpg-bun](../wiki/globals) / QUEUE\_COMMANDS

# Variable: QUEUE\_COMMANDS

> `const` **QUEUE\_COMMANDS**: `ReadonlySet`\<`string`\>

Defined in: [src/protocol.ts:58](https://github.com/TweeZee/ssrpg-bun/blob/main/src/protocol.ts#L58)

Names that are sent as queued commands rather than variable or function
calls.

## Remarks

Commands carry a single pre-joined payload string and no type tags. The
`>` entry is StoneScript's print command.

## See

[CommandQueue](../wiki/Class.CommandQueue) for the typed wrappers around these names.
