import defaultDictionary from './locales/en/messages.json';
import { I18nDictionary, Dictionary } from '../../../types/configs';
import { LeavesDictKeys } from '../../types-internal/i18n-internal-namespace';

/**
 * Type for all available internal dictionary strings
 */
type DictKeys = LeavesDictKeys<typeof defaultDictionary>;

/**
 * This class will responsible for the translation through the language dictionary
 */
export default class I18n {
  /**
   * Property that stores messages dictionary
   */
  private static currentDictionary: I18nDictionary = defaultDictionary;

  /**
   * Type-safe translation for internal UI texts:
   * Perform translation of the string by namespace and a key
   *
   * @example I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune')
   *
   * @param internalNamespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  public static ui(internalNamespace: string, dictKey: DictKeys): string {
    return I18n._t(internalNamespace, dictKey);
  }

  /**
   * Translate for external strings that is not presented in default dictionary.
   * For example, for user-specified tool names
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  public static t(namespace: string, dictKey: string): string {
    return I18n._t(namespace, dictKey);
  }

  /**
   * Adjust module for using external dictionary
   *
   * @param dictionary - new messages list to override default
   */
  public static setDictionary(dictionary: I18nDictionary): void {
    I18n.currentDictionary = dictionary;
  }

  /**
   * Perform translation both for internal and external namespaces
   * If there is no translation found, returns passed key as a translated message
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  private static _t(namespace: string, dictKey: string): string {
    const section = I18n.getNamespace(namespace);

    /**
     * For Console Message to Check Section is defined or not
     * if (section === undefined) {
     *  _.logLabeled('I18n: section %o was not found in current dictionary', 'log', namespace);
     * }
     */

    if (!section || !section[dictKey]) {
      return dictKey;
    }

    return section[dictKey] as string;
  }

  /**
   * Find messages section by namespace path
   *
   * @param namespace - path to section
   */
  private static getNamespace(namespace: string): Dictionary {
    const parts = namespace.split('.');

    return parts.reduce((section, part) => {
      if (!section || !Object.keys(section).length) {
        return {};
      }

      return section[part];
    }, I18n.currentDictionary);
  }
}
