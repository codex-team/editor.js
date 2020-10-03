import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
import { ToolType } from '../tools';
import { logLabeled } from '../../utils';
import Module from '../../__module';

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
  private static getNamespace(toolName: string, toolType: ToolType): string {
    switch (toolType) {
      case ToolType.Block:
      case ToolType.Inline:
        return `tools.${toolName}`;
      case ToolType.Tune:
        return `blockTunes.${toolName}`;
    }
  }

  /**
   * Return I18n API methods with global dictionary access
   */
  public get methods(): I18n {
    return {
      t: (): string | undefined => {
        logLabeled('I18n.t() method can be accessed only from Tools', 'warn');

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
  public getMethodsForTool(toolName: string, toolType: ToolType): I18n {
    return Object.assign(
      this.methods,
      {
        t: (dictKey: string): string => {
          return I18nInternal.t(I18nAPI.getNamespace(toolName, toolType), dictKey);
        },
      });
  }
}
