[ssrpg-bun](../wiki/globals) / RunOptions

# Interface: RunOptions

Defined in: [src/interface.ts:91](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L91)

Options for [SSRPGInterface.run](../wiki/Class.SSRPGInterface#run).

## Properties

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [src/interface.ts:99](https://github.com/TweeZee/ssrpg-bun/blob/main/src/interface.ts#L99)

Signal that stops the loop.

#### Remarks

Aborting disconnects, which unblocks the wait for the next frame and lets
[SSRPGInterface.run](../wiki/Class.SSRPGInterface#run) return normally.
