/**
 * The `te` namespace.
 *
 * @packageDocumentation
 */
import { namespace, type CallHost } from "./base";

/**
 * `te` — text and localisation helpers.
 *
 * @remarks
 * Useful for matching on names in a language-independent way, though reading
 * an `id` member such as {@link Foe.id} is usually simpler.
 *
 * @experimental The Python reference implementation left this class disabled,
 * so the game may not expose it over MindConnect yet.
 */
export interface Text {
  /**
   * Reads `te.language`.
   *
   * @returns The active language code.
   */
  language(): Promise<string | null>;

  /**
   * Calls `te.xt` — translates a text id into the active language.
   *
   * @param text - Text id to translate.
   * @returns The translated string.
   */
  xt(text: string): Promise<string | null>;

  /**
   * Calls `te.GetTID`.
   *
   * @param text - A translated string.
   * @returns The text id it came from.
   */
  GetTID(text: string): Promise<string | null>;

  /**
   * Calls `te.ToEnglish`.
   *
   * @param text - A localised string.
   * @returns The English equivalent.
   */
  ToEnglish(text: string): Promise<string | null>;
}

/**
 * Builds the {@link Text} namespace.
 *
 * @param host - The interface the calls are routed through.
 * @returns Accessors for `te`.
 *
 * @experimental See {@link Text}.
 */
export function createText(host: CallHost): Text {
  const ns = namespace(host, "te");
  return {
    language: () => ns.str("language"),
    xt: (text) => ns.str("xt", text),
    GetTID: (text) => ns.str("GetTID", text),
    ToEnglish: (text) => ns.str("ToEnglish", text),
  };
}
