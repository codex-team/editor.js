import { Toolbar } from '../../../../types/api';
import BaseApiModule from './base';

/**
 * @class ToolbarAPI
 * Provides methods for working with the Toolbar
 */
export default class ToolbarAPI extends BaseApiModule {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  public methodsToDisableInReadonly: string[] = [
    'close',
    'open',
  ];

  /**
   * Available methods
   *
   * @returns {Toolbar}
   */
  public get methods(): Toolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
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
