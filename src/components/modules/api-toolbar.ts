declare var Module: any;

import { IToolbarAPI } from '../interfaces/api';

/**
 * @class ToolbarsApi
 * provides with methods working with Toolbar
 */
export default class ToolbarsAPI extends Module implements IToolbarAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {IBlocksAPI}
   */
  get methods(): IToolbarAPI {
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
