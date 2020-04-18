import Module from '../../__module';
import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
/**
 * Provides methods for working with i18n
 */
export default class I18nAPI extends Module {
  /**
   * Available methods
   */
  public get methods(): I18n {
    return {
      t: (namespace: string, dictKey: string): string => I18nInternal.t(namespace, dictKey),
      has: (namespace: string, dictKey: string): boolean => I18nInternal.has(namespace, dictKey),
    };
  }
}
