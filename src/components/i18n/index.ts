import defaultLocale from './locales/en/messages.json';

/**
 * This class will responsible for the translation through the language dictionary
 */
export default class I18n {
  public static t(namespace: string, dictKey: string): string {
    const section = I18n.getSection(namespace);

    if (!section || !section[dictKey]) {
      return dictKey;
    }

    return section[dictKey];
  }

  public static has(namespace: string, dictKey: string): boolean {
    const section = I18n.getSection(namespace);

    return section && section[dictKey];
  }

  public static setLocale(locale: {[key: string]: any}) {
    I18n.currentLocale = locale;
  }

  private static currentLocale: {[key: string]: any} = defaultLocale;

  private static getSection(namespace: string) {
    const parts = namespace.split('.');

    return parts.reduce((key, part) => {
      if (!key || !Object.keys(key).length) {
        return {};
      }

      return key[part];
    }, I18n.currentLocale);
  }
}
