import Module from '../../__module';
import {InlineToolbar} from '../../../../types/api';

/**
 * @class ToolbarAPI
 * provides with methods working with Toolbar
 */
export default class InlineToolbarAPI extends Module {
  /**
   * Available methods
   * @return {InlineToolbar}
   */
  get methods(): InlineToolbar {
    return {
      toggleActions: (toolName: string) => this.toggleActions(toolName),
    };
  }

  /**
   * Toggles actions
   */
  public toggleActions(toolName: string): void {
    this.Editor.InlineToolbar.toggleActions(toolName);
  }
}
