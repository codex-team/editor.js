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
  ? D
  : D extends Indexed<string>
    ? keyof D
    : D extends Indexed<any>
      ? { [K in keyof D]: LeavesDictKeys<D[K]> }[keyof D]
      : never;

/**
 * Provide type-safe access to the available namespaces of the dictionary
 *
 * Can be uses as:
 *    DictNamespaces<typeof myDictionary>
 *
 * where myDictionary is a JSON with messages
 */
export type DictNamespaces<D> = {
  [K in keyof D]: D[K] extends Indexed<string>
    ? string
    : DictNamespaces<D[K]>;
}

