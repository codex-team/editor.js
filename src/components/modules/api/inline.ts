import Module from '../../__module';
import { InlineToolbar } from '../../../../types/api/inline';

/**
 * @class InlineToolbarAPI
 * provides with methods working with InlineToolbar
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
   * Open inlineToolbar
   */
  public open(): void {
    this.Editor.InlineToolbar.open();
  }

  /**
   * Close inlineToolbar
   */
  public close(): void {
    this.Editor.InlineToolbar.close();
  }

}
