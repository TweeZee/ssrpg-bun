import { namespace, type CallHost } from "./base";

/**
 * `te` — text and localisation helpers.
 *
 * @experimental The Python reference implementation never enabled this class.
 */
export interface Text {
  language(): Promise<string | null>;
  /** Translates a text id into the active language. */
  xt(text: string): Promise<string | null>;
  GetTID(text: string): Promise<string | null>;
  ToEnglish(text: string): Promise<string | null>;
}

export function createText(host: CallHost): Text {
  const ns = namespace(host, "te");
  return {
    language: () => ns.str("language"),
    xt: (text) => ns.str("xt", text),
    GetTID: (text) => ns.str("GetTID", text),
    ToEnglish: (text) => ns.str("ToEnglish", text),
  };
}
