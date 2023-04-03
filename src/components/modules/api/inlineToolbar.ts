import { InlineToolbar } from '../../../../types/api/inline-toolbar';
import Module from '../../__module';

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
 */
export default class InlineToolbarAPI extends Module {
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
