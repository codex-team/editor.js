import Module from '../../__module';
import { InlineToolbar } from '../../../../types/api/inline-toolbar';

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
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
