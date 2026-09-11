# ssrpg-bun v0.3.0

A Bun/TypeScript interface for Stone Story RPG.

## Remarks

Port of the Python `ssrpgif` library by ArtificialPotato, speaking
MindConnect protocol [v0.3](../wiki/Variable.PROTOCOL_VERSION) (Stone Story RPG
v4.25.0 or above).

Start at [SSRPGInterface](../wiki/Class.SSRPGInterface) — it owns the connection, the per-step cache
and the command queue, and exposes one namespace per StoneScript class.
[MindConnectClient](../wiki/Class.MindConnectClient) sits underneath if you want the protocol without
the conveniences, and the [protocol helpers](../wiki/Function.buildPacket) are
exported for tooling and tests.

[StoneScriptAPI](../wiki/Interface.StoneScriptAPI) is the type-level model of the game's own API. It is
what lets [SSRPGInterface.call](../wiki/Class.SSRPGInterface#call) reject a name the game does not have
and narrow the result to that member's type, and it can be extended by
declaration merging when the game moves ahead of this library.

## Example

```ts
import { SSRPGInterface } from "ssrpg-bun";

const ssrpg = new SSRPGInterface({ mode: "sync" });
await ssrpg.connect();

await ssrpg.run(async (context) => {
  if (context !== "pre") return;
  ssrpg.print("hello bun!", { x: 1, y: 1 });
  if ((await ssrpg.foe.hp()) === 1) ssrpg.loc.Pause();
});
```

## Classes

- [MindConnectClient](../wiki/Class.MindConnectClient)
- [CommandQueue](../wiki/Class.CommandQueue)
- [MindConnectError](../wiki/Class.MindConnectError)
- [ConnectFailedError](../wiki/Class.ConnectFailedError)
- [ConnectionClosedError](../wiki/Class.ConnectionClosedError)
- [ProtocolError](../wiki/Class.ProtocolError)
- [RequestTimeoutError](../wiki/Class.RequestTimeoutError)
- [ModeError](../wiki/Class.ModeError)
- [SSRPGInterface](../wiki/Class.SSRPGInterface)

## Interfaces

- [ClientOptions](../wiki/Interface.ClientOptions)
- [AI](../wiki/Interface.AI)
- [Armor](../wiki/Interface.Armor)
- [CallHost](../wiki/Interface.CallHost)
- [Namespace](../wiki/Interface.Namespace)
- [Buffs](../wiki/Interface.Buffs)
- [PlayerBuffs](../wiki/Interface.PlayerBuffs)
- [PrintOptions](../wiki/Interface.PrintOptions)
- [CommandFlusher](../wiki/Interface.CommandFlusher)
- [Draw](../wiki/Interface.Draw)
- [Encounter](../wiki/Interface.Encounter)
- [Event](../wiki/Interface.Event)
- [Foe](../wiki/Interface.Foe)
- [Harvest](../wiki/Interface.Harvest)
- [Input](../wiki/Interface.Input)
- [Head](../wiki/Interface.Head)
- [Item](../wiki/Interface.Item)
- [Key](../wiki/Interface.Key)
- [Loc](../wiki/Interface.Loc)
- [Pickup](../wiki/Interface.Pickup)
- [Player](../wiki/Interface.Player)
- [Position](../wiki/Interface.Position)
- [Resource](../wiki/Interface.Resource)
- [Screen](../wiki/Interface.Screen)
- [Storage](../wiki/Interface.Storage)
- [Summon](../wiki/Interface.Summon)
- [Text](../wiki/Interface.Text)
- [Variable](../wiki/Interface.Variable)
- [SSRPGInterfaceOptions](../wiki/Interface.SSRPGInterfaceOptions)
- [RunOptions](../wiki/Interface.RunOptions)
- [ParsedSignal](../wiki/Interface.ParsedSignal)
- [Read](../wiki/Interface.Read)
- [Fn](../wiki/Interface.Fn)
- [Act](../wiki/Interface.Act)
- [StoneScriptAPI](../wiki/Interface.StoneScriptAPI)
- [StoneScriptCommands](../wiki/Interface.StoneScriptCommands)
- [StepSignal](../wiki/Interface.StepSignal)

## Type Aliases

- [PrintArg](../wiki/TypeAlias.PrintArg)
- [Debuffs](../wiki/TypeAlias.Debuffs)
- [PlayerDebuffs](../wiki/TypeAlias.PlayerDebuffs)
- [StepFunction](../wiki/TypeAlias.StepFunction)
- [Float](../wiki/TypeAlias.Float)
- [Decimal](../wiki/TypeAlias.Decimal)
- [StoredValue](../wiki/TypeAlias.StoredValue)
- [Joined](../wiki/TypeAlias.Joined)
- [ColorPreset](../wiki/TypeAlias.ColorPreset)
- [Color](../wiki/TypeAlias.Color)
- [HexDigit](../wiki/TypeAlias.HexDigit)
- [StrictColor](../wiki/TypeAlias.StrictColor)
- [ArgList](../wiki/TypeAlias.ArgList)
- [HudFlag](../wiki/TypeAlias.HudFlag)
- [HudOpts](../wiki/TypeAlias.HudOpts)
- [ValidateHudOpts](../wiki/TypeAlias.ValidateHudOpts)
- [ToggleFeature](../wiki/TypeAlias.ToggleFeature)
- [ActivateTarget](../wiki/TypeAlias.ActivateTarget)
- [ItemCriteria](../wiki/TypeAlias.ItemCriteria)
- [Loose](../wiki/TypeAlias.Loose)
- [AbilityId](../wiki/TypeAlias.AbilityId)
- [SoundId](../wiki/TypeAlias.SoundId)
- [MusicId](../wiki/TypeAlias.MusicId)
- [AmbientId](../wiki/TypeAlias.AmbientId)
- [KeyAction](../wiki/TypeAlias.KeyAction)
- [KeyName](../wiki/TypeAlias.KeyName)
- [SearchFilter](../wiki/TypeAlias.SearchFilter)
- [CallName](../wiki/TypeAlias.CallName)
- [QueueName](../wiki/TypeAlias.QueueName)
- [CommandName](../wiki/TypeAlias.CommandName)
- [ArgsOf](../wiki/TypeAlias.ArgsOf)
- [QueueArgsOf](../wiki/TypeAlias.QueueArgsOf)
- [ResultOf](../wiki/TypeAlias.ResultOf)
- [Nullable](../wiki/TypeAlias.Nullable)
- [TypedRequest](../wiki/TypeAlias.TypedRequest)
- [RequestFor](../wiki/TypeAlias.RequestFor)
- [MultiCallResults](../wiki/TypeAlias.MultiCallResults)
- [ResultOfRequest](../wiki/TypeAlias.ResultOfRequest)
- [ReadSpec](../wiki/TypeAlias.ReadSpec)
- [ResultOfSpec](../wiki/TypeAlias.ResultOfSpec)
- [Mode](../wiki/TypeAlias.Mode)
- [StepContext](../wiki/TypeAlias.StepContext)
- [Scalar](../wiki/TypeAlias.Scalar)
- [CallValue](../wiki/TypeAlias.CallValue)
- [Request](../wiki/TypeAlias.Request)

## Variables

- [US](../wiki/Variable.US)
- [SIGNAL](../wiki/Variable.SIGNAL)
- [EOF](../wiki/Variable.EOF)
- [PROTOCOL\_VERSION](../wiki/Variable.PROTOCOL_VERSION)
- [MAX\_REQUEST\_ID](../wiki/Variable.MAX_REQUEST_ID)
- [QUEUE\_COMMANDS](../wiki/Variable.QUEUE_COMMANDS)

## Functions

- [createAI](../wiki/Function.createAI)
- [createArmor](../wiki/Function.createArmor)
- [namespace](../wiki/Function.namespace)
- [callable](../wiki/Function.callable)
- [createBuffs](../wiki/Function.createBuffs)
- [createPlayerBuffs](../wiki/Function.createPlayerBuffs)
- [createDebuffs](../wiki/Function.createDebuffs)
- [createPlayerDebuffs](../wiki/Function.createPlayerDebuffs)
- [createDraw](../wiki/Function.createDraw)
- [createEncounter](../wiki/Function.createEncounter)
- [createEvent](../wiki/Function.createEvent)
- [createFoe](../wiki/Function.createFoe)
- [createHarvest](../wiki/Function.createHarvest)
- [createInput](../wiki/Function.createInput)
- [createHead](../wiki/Function.createHead)
- [createItem](../wiki/Function.createItem)
- [createKey](../wiki/Function.createKey)
- [createLoc](../wiki/Function.createLoc)
- [createPickup](../wiki/Function.createPickup)
- [createPlayer](../wiki/Function.createPlayer)
- [createPosition](../wiki/Function.createPosition)
- [createResource](../wiki/Function.createResource)
- [createScreen](../wiki/Function.createScreen)
- [createStorage](../wiki/Function.createStorage)
- [createSummon](../wiki/Function.createSummon)
- [createText](../wiki/Function.createText)
- [createVariable](../wiki/Function.createVariable)
- [buildPacket](../wiki/Function.buildPacket)
- [autoCast](../wiki/Function.autoCast)
- [asInt](../wiki/Function.asInt)
- [asBool](../wiki/Function.asBool)
- [asStr](../wiki/Function.asStr)
- [parseSignal](../wiki/Function.parseSignal)
