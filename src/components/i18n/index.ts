import defaultDictionary from './locales/en/messages.json';

/**
 * This class will responsible for the translation through the language dictionary
 */
export default class I18n {
  /**
   * Property that stores messages dictionary
   */
  private static currentDictionary: {[key: string]: object} = defaultDictionary;

  /**
   * Perform translation of the string by namespace and a key
   * If there is no translation found, returns passed key as a translated message
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  public static t(namespace: string, dictKey: string): string {
    const section = I18n.getSection(namespace);

    if (!section || !section[dictKey]) {
      return dictKey;
    }

    return section[dictKey];
  }

  /**
   * Adjust module for using external dictionary
   *
   * @param dictionary - new messages list to override default
   */
  public static setDictionary(dictionary: {[key: string]: any}): void {
    I18n.currentDictionary = dictionary;
  }

  /**
   * Find messages section by namespace path
   *
   * @param namespace - path to section
   */
  private static getSection(namespace: string): object|undefined {
    const parts = namespace.split('.');

    return parts.reduce((key, part) => {
      if (!key || !Object.keys(key).length) {
        return {};
      }

      return key[part];
    }, I18n.currentDictionary);
  }
}
