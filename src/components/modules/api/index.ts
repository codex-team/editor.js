/**
 * @module API
 * @copyright <CodeX> 2018
 *
 * Each block has an Editor API instance to use provided public methods
 * if you cant to read more about how API works, please see docs
 */
import Module from '../../__module';
import { API as APIInterfaces } from '../../../../types';
import { ToolType } from '../tools';

/**
 * @class API
 */
export default class API extends Module {
  /**
   * Property keeps cached methods so that it is used once for all tools
   */
  private methodsCached: APIInterfaces;

  /**
   * Editor.js Core API modules
   */
  public get methods(): APIInterfaces {
    /**
     * This getter is called for all tools but it is idempotent
     * that's why we cache the result
     */
    if (!this.methodsCached) {
      const apiComponents = {
        blocks: this.Editor.BlocksAPI,
        caret: this.Editor.CaretAPI,
        events: this.Editor.EventsAPI,
        listeners: this.Editor.ListenersAPI,
        notifier: this.Editor.NotifierAPI,
        sanitizer: this.Editor.SanitizerAPI,
        saver: this.Editor.SaverAPI,
        selection: this.Editor.SelectionAPI,
        styles: this.Editor.StylesAPI,
        toolbar: this.Editor.ToolbarAPI,
        inlineToolbar: this.Editor.InlineToolbarAPI,
        tooltip: this.Editor.TooltipAPI,
        i18n: this.Editor.I18nAPI,
        readOnly: this.Editor.ReadOnlyAPI,
      };

      const allMethods = {} as APIInterfaces;

      for (const apiComponent in apiComponents) {
        const apiModule = apiComponents[apiComponent];

        /**
         * If module provides API-methods
         */
        if (apiModule.methods) {
          const methods = apiModule.methods;

          if (apiModule.methodsToDisableInReadonly && apiModule.methodsToDisableInReadonly.length > 0) {
            this.decorateWithReadOnlyFunction(apiComponent, methods, apiModule.methodsToDisableInReadonly);
          }

          allMethods[apiComponent] = methods;
        }

        /**
         * If module provides CSS-styles
         */
        if (apiModule.classes) {
          allMethods[apiComponent] = apiModule.classes;
        }
      }

      this.methodsCached = allMethods;
    }

    return this.methodsCached;
  }

  /**
   * Returns Editor.js Core API methods for passed tool
   *
   * @param toolName - how user name tool. It can be used in some API logic,
   *                   for example in i18n to provide namespaced dictionary
   *
   * @param toolType - 'block' for Block Tool, 'inline' for Inline Tool, 'tune' for Block Tunes
   */
  public getMethodsForTool(toolName: string, toolType = ToolType.Block): APIInterfaces {
    return Object.assign(
      this.methods,
      {
        i18n: this.Editor.I18nAPI.getMethodsForTool(toolName, toolType),
      }
    ) as APIInterfaces;
  }

  /**
   * Returns decorated list of methods that have read-only restriction
   *
   * @param methodGroup - sss
   * @param methods - api module methods
   * @param list - the list of methods that should be decorated
   */
  private decorateWithReadOnlyFunction(methodGroup, methods, list): void {
    for (const method in methods) {
      if (list.includes(method)) {
        methods[method] = this.Editor.ReadOnly.offDecorator(methods[method], methodGroup);
      }
    }
  }
}
