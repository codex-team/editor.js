import Module from '../../__module';
import * as API from '../../../../types/api';

/**
 * @class ToolbarAPI
 * provides with methods working with Toolbar
 */
export default class ToolbarAPI extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {API.toolbar}
   */
  get methods(): API.toolbar {
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
