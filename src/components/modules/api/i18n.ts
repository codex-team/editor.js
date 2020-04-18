import Module from '../../__module';
import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
/**
 * Provides methods for working with i18n
 */
export default class I18nAPI extends Module {
  /**
   * Return I18n API methods with tool namespaced dictionary
   * @param toolName - name of tool. Used to provide dictionary only for this tool
   */
  public getMethodsForTool(toolName: string): I18n {
    return {
      t: (dictKey: string): string => I18nInternal.t(`tools.${toolName}`, dictKey),
      has: (dictKey: string): boolean => I18nInternal.has(`tools.${toolName}`, dictKey),
    };
  }
}
