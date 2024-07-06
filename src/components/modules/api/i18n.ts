import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
import { logLabeled } from '../../utils';
import Module from '../../__module';

/**
 * Provides methods for working with i18n
 */
export default class I18nAPI extends Module {
  /**
   * Return namespace section for tool or block tune
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  private static getNamespace(toolName, isTune): string {
    if (isTune) {
      return `blockTunes.${toolName}`;
    }

    return `tools.${toolName}`;
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
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  public getMethodsForTool(toolName: string, isTune: boolean): I18n {
    return Object.assign(
      this.methods,
      {
        t: (dictKey: string): string => {
          return I18nInternal.t(I18nAPI.getNamespace(toolName, isTune), dictKey);
        },
      });
  }
}
