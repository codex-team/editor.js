declare global {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardLayoutMap
   */
  interface KeyboardLayoutMap {
    get(key: string): string | undefined;
    has(key: string): boolean;
    size: number;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    forEach(callbackfn: (value: string, key: string, map: KeyboardLayoutMap) => void, thisArg?: unknown): void;
  }

  /**
   * The getLayoutMap() method of the Keyboard interface returns a Promise
   * that resolves with an instance of KeyboardLayoutMap which is a map-like object
   * with functions for retrieving the strings associated with specific physical keys.
   * https://developer.mozilla.org/en-US/docs/Web/API/Keyboard/getLayoutMap
   */
  interface Keyboard {
    getLayoutMap(): Promise<KeyboardLayoutMap>;
  }

  interface Navigator {
    /**
     * Keyboard API. Not supported by Firefox and Safari.
     */
    keyboard?: Keyboard;
  }
}

/**
 * Returns real layout-related keyboard key for a given key code.
 * For example, for "Slash" it will return "/" on US keyboard and "-" on Spanish keyboard.
 *
 * Works with Keyboard API which is not supported by Firefox and Safari. So fallback is used for these browsers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Keyboard
 * @param code - {@link https://www.w3.org/TR/uievents-code/#key-alphanumeric-writing-system}
 * @param fallback - fallback value to be returned if Keyboard API is not supported (Safari, Firefox)
 */
export async function getKeyboardKeyForCode(code: string, fallback: string): Promise<string> {
  const keyboard = navigator.keyboard;

  if (!keyboard) {
    return fallback;
  }

  const map = await keyboard.getLayoutMap();
  const key = map.get(code);

  return key || fallback;
}
