import { InlineToolbar } from '../../../../types/api/inline-toolbar';
import BaseApiModule from './base';

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
 */
export default class InlineToolbarAPI extends BaseApiModule {
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
   * @returns {InlineToolbar}
   */
  public get methods(): InlineToolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
    };
  }

  /**
   * Open Inline Toolbar
   */
  public open(): void {
    this.Editor.InlineToolbar.tryToShow();
  }

  /**
   * Close Inline Toolbar
   */
  public close(): void {
    this.Editor.InlineToolbar.close();
  }
}
