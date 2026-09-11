[ssrpg-bun](../wiki/globals) / Mode

# Type Alias: Mode

> **Mode** = `"sync"` \| `"async"` \| `"exclusive"`

Defined in: [src/types.ts:24](https://github.com/TweeZee/ssrpg-bun/blob/main/src/types.ts#L24)

Operation mode of the interface.

## Remarks

The mode must match the `//MindConnect: [mode]` header on the very first
line of the in-game Stonescript:

- `sync` — the script runs alongside an in-game Stonescript. Every game
  frame produces a [\`pre\`](../wiki/TypeAlias.StepContext) step (before the in-game
  script runs) and a `post` step (after it).
- `exclusive` — the script owns the game logic. One step per frame, always
  with the `exclusive` context.
- `async` — no step signals at all. Requests are fire-and-forget, and
  [SSRPGInterface.step](../wiki/Class.SSRPGInterface#step) is unavailable.

## See

[SSRPGInterfaceOptions.mode](../wiki/Interface.SSRPGInterfaceOptions#mode)
