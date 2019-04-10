import Module from '../../__module';
import {Toolbar} from '../../../../types/api';

/**
 * @class ToolbarAPI
 * Provides methods for working with the Toolbar
 */
export default class ToolbarAPI extends Module {
  /**
   * Available methods
   * @return {Toolbar}
   */
  get methods(): Toolbar {
    return {
      close: () => this.close(),
      open: () => this.open(),
    };
  }

  /**
   * Open toolbar
   */
  public open(): void {
    this.Editor.Toolbar.open();
  }

  /**
   * Close toolbar and all included elements
   */
  public close(): void {
    this.Editor.Toolbar.close();
  }

}
