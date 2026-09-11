/**
 * The `loc` namespace.
 *
 * @packageDocumentation
 */
import { callable, namespace, type CallHost } from "./base";

/**
 * `loc` — the location the player is currently in.
 *
 * @remarks
 * Call the namespace itself to read the location's name, mirroring
 * StoneScript, where `loc` is both a variable and a class.
 *
 * {@link Loc.Leave} and {@link Loc.Pause} are commands rather than reads, so
 * they are queued and take effect at the end of the step.
 *
 * @example
 * ```ts
 * if (await ssrpg.loc.begin()) {
 *   // first frame of the location — reset per-run state here
 * }
 * ```
 */
export interface Loc {
  /**
   * Reads `loc`.
   *
   * @returns The location's display name.
   */
  (): Promise<string | null>;

  /**
   * Reads `loc.id`.
   *
   * @returns The location's internal id, e.g. `caustic_caves`.
   */
  id(): Promise<string | null>;

  /**
   * Reads `loc.name`.
   *
   * @returns The location's display name.
   */
  name(): Promise<string | null>;

  /**
   * Reads `loc.stars`.
   *
   * @returns How many stars the player has earned here.
   */
  stars(): Promise<number | null>;

  /**
   * Reads `loc.begin`.
   *
   * @returns `true` during the first frame of the location, which is the place
   * to reset per-run state.
   */
  begin(): Promise<boolean>;

  /**
   * Reads `loc.loop`.
   *
   * @returns Whether the location has looped back to its start.
   */
  loop(): Promise<boolean>;

  /**
   * Reads `loc.bestTime`.
   *
   * @returns The player's best completion time here, in frames.
   */
  bestTime(): Promise<number | null>;

  /**
   * Reads `loc.averageTime`.
   *
   * @returns The player's average completion time here, in frames.
   */
  averageTime(): Promise<number | null>;

  /**
   * Reads `loc.isQuest`.
   *
   * @returns Whether this location is a quest.
   */
  isQuest(): Promise<boolean>;

  /**
   * Reads `loc.gp`.
   *
   * @returns Gold pieces collected in this location so far.
   */
  gp(): Promise<number | null>;

  /**
   * Queues `loc.Leave` — leaves the location at the end of the step.
   */
  Leave(): void;

  /**
   * Queues `loc.Pause` — pauses the game at the end of the step.
   */
  Pause(): void;
}

/**
 * Builds the {@link Loc} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `loc`.
 */
export function createLoc(host: CallHost): Loc {
  const ns = namespace(host, "loc");
  return callable(() => ns.str(""), {
    id: () => ns.str("id"),
    name: () => ns.str("name"),
    stars: () => ns.int("stars"),
    begin: () => ns.bool("begin"),
    loop: () => ns.bool("loop"),
    bestTime: () => ns.int("bestTime"),
    averageTime: () => ns.int("averageTime"),
    isQuest: () => ns.bool("isQuest"),
    gp: () => ns.int("gp"),
    Leave: () => ns.queue("Leave"),
    Pause: () => ns.queue("Pause"),
  }) satisfies Loc;
}
