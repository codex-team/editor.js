import { I18n } from '../../../../types/api';
import I18nInternal from '../../i18n';
import { logLabeled } from '../../utils';
import Module from '../../__module';
import { ToolClass } from '../../tools/collection';

/**
 * Provides methods for working with i18n
 */
export default class I18nAPI extends Module {
  /**
   * Return namespace section for tool or block tune
   *
   * @param tool - tool object
   */
  private static getNamespace(tool: ToolClass): string {
    if (tool.isTune) {
      return `blockTunes.${tool.name}`;
    }

    return `tools.${tool.name}`;
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
   * @param tool - Tool object
   */
  public getMethodsForTool(tool: ToolClass): I18n {
    return Object.assign(
      this.methods,
      {
        t: (dictKey: string): string => {
          return I18nInternal.t(I18nAPI.getNamespace(tool), dictKey);
        },
      });
  }
}
