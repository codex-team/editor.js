import Module from '../../__module';
import { InlineToolbar } from '../../../../types/api/inline';

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
      close: () => this.close(),
      open: () => this.open(),
    };
  }

  /**
   * Open toolbar
   */
  public open(): void {
    this.Editor.InlineToolbar.open();
  }

  /**
   * Close toolbar and all included elements
   */
  public close(): void {
    this.Editor.InlineToolbar.close();
  }

}
