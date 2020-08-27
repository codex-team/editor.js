/**
 * Available options of i18n config property
 */
import { I18nDictionary } from './i18n-dictionary';

export interface I18nConfig {
  /**
   * Dictionary used for translation
   */
  messages?: I18nDictionary;

  /**
   * Text direction. If not set, uses ltr
   */
  direction?: 'ltr' | 'rtl';
}
