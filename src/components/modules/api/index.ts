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
   * Editor.js Core API modules
   */
  public get methods(): APIInterfaces {
    return {
      blocks: this.Editor.BlocksAPI.methods,
      caret: this.Editor.CaretAPI.methods,
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
    };
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
}
