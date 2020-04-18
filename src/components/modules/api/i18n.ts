import Module from '../../__module';
import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
/**
 * Provides methods for working with i18n
 */
export default class I18nAPI extends Module {
  /**
   * Return namespace section for tool or block tune
   *
   * @param toolName - name of tool. Used to provide dictionary only for this tool
   * @param toolType - 'block' for Block Tool, 'inline' for Inline Tool, 'tune' for Block Tunes
   */
  private static getNamespace(toolName: string, toolType: string): string {
    switch (toolType) {
      case 'block':
      case 'inline':
        return `tools.${toolName}`;
      case 'tune':
        return `blockTunes.${toolName}`;
    }
  }

  /**
   * Return I18n API methods with global dictionary access
   */
  public get methods(): I18n {
    return {
      t: (namespace: string, dictKey: string): string => I18nInternal.t(namespace, dictKey),
      tn: (): string | undefined => {
        console.warn('I18n.tn method can be accessed only from Tools');

        return undefined;
      },
    };
  }

  /**
   * Return I18n API methods with tool namespaced dictionary
   *
   * @param toolName - name of tool. Used to provide dictionary only for this tool
   * @param toolType - 'block' for Block Tool, 'inline' for Inline Tool, 'tune' for Block Tunes
   */
  public getMethodsForTool(toolName: string, toolType: string): I18n {
    return {
      t: (namespace: string, dictKey: string): string => I18nInternal.t(namespace, dictKey),
      tn: (dictKey: string): string => I18nInternal.t(I18nAPI.getNamespace(toolName, toolType), dictKey),
    };
  }
}
