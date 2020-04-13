import defaultLocale from './locales/en/messages.json';

/**
 * This class will responsible for the translation through the language dictionary
 */
export default class I18n {

  /**
   * Хер че поймешь без доков
   */
  public static t(namespace: string, dictKey: string): string {
    const parts = namespace.split('.');

    const l = parts.reduce((key, part) => {
      if (!key || !Object.keys(key).length) {
        return {};
      }

      return key[part];
    }, defaultLocale);

    console.log('l', l, dictKey);

    if (!l || !l[dictKey]) {
      return dictKey;
    }

    return l[dictKey];
  }

  private currentLocale = 'en';

  private dictionary;

  public setLocale(locale: string) {
    this.currentLocale = locale;
  }
}
