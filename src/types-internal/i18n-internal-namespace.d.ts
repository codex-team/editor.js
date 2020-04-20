/**
* Decorator above the type object
*/
type Indexed<T> = { [key: string]: T };

/**
 * Type for I18n dictionary values that can be strings or dictionary sub-sections
 *
 * Can be used as:
 *   LeavesDictKeys<typeof myDictionary>
 *
 * where myDictionary is a JSON with messages
 */
export type LeavesDictKeys<D> = D extends string
  /**
   * If generic type is string, just return it
   */
  ? D
  /**
   * If generic type is object that has only one level and contains only strings, return it's keys union
   *
   * { key: "string", anotherKey: "string" } => "key" | "anotherKey"
   *
   */
  : D extends Indexed<string>
    ? keyof D
    /**
     * If generic type is object, but not the one described above,
     * use LeavesDictKey on it's values recursively and union the results
     *
     * { "rootKey": { "subKey": "string" }, "anotherRootKey": { "anotherSubKey": "string" } } => "subKey" | "anotherSubKey"
     *
     */
    : D extends Indexed<any>
      ? { [K in keyof D]: LeavesDictKeys<D[K]> }[keyof D]

      /**
       * In other cases, return never type
       */
      : never;

/**
 * Provide type-safe access to the available namespaces of the dictionary
 *
 * Can be uses as:
 *    DictNamespaces<typeof myDictionary>
 *
 * where myDictionary is a JSON with messages
 */
export type DictNamespaces<D extends object> = {
  /**
   * Iterate through generic type keys
   *
   * If value under current key is object that has only one level and contains only strings, return string type
   */
  [K in keyof D]: D[K] extends Indexed<string>
    ? string
    /**
     * If value under current key is object with depth more than one, apply DictNamespaces recursively
     */
    : D[K] extends Indexed<any>
      ? DictNamespaces<D[K]>
      /**
       * In other cases, return never type
       */
      : never;
}

