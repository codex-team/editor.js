/**
 * @module API
 * @copyright <CodeX> 2018
 *
 * Each block has an Editor API instance to use provided public methods
 * if you cant to read more about how API works, please see docs
 */
import Module from '../../__module';
import { API as APIInterfaces } from '../../../../types';

/**
 * @class API
 */
export default class API extends Module {
  /**
   * Editor.js Core API modules
   */
  public get methods(): APIInterfaces {
    return {
      blocks: this.Editor.BlocksAPI.methods,
      caret: this.Editor.CaretAPI.methods,
      tools: this.Editor.ToolsAPI.methods,
      events: this.Editor.EventsAPI.methods,
      listeners: this.Editor.ListenersAPI.methods,
      notifier: this.Editor.NotifierAPI.methods,
      sanitizer: this.Editor.SanitizerAPI.methods,
      saver: this.Editor.SaverAPI.methods,
      selection: this.Editor.SelectionAPI.methods,
      styles: this.Editor.StylesAPI.classes,
      toolbar: this.Editor.ToolbarAPI.methods,
      inlineToolbar: this.Editor.InlineToolbarAPI.methods,
      tooltip: this.Editor.TooltipAPI.methods,
      i18n: this.Editor.I18nAPI.methods,
      readOnly: this.Editor.ReadOnlyAPI.methods,
      ui: this.Editor.UiAPI.methods,
    };
  }

  /**
   * Returns Editor.js Core API methods for passed tool
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  public getMethodsForTool(toolName: string, isTune: boolean): APIInterfaces {
    return Object.assign(
      this.methods,
      {
        i18n: this.Editor.I18nAPI.getMethodsForTool(toolName, isTune),
      }
    ) as APIInterfaces;
  }
}
