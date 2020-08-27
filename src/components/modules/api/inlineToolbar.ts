import Module from '../../__module';
import { InlineToolbar } from '../../../../types/api/inline-toolbar';

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
 */
export default class InlineToolbarAPI extends Module {
  /**
   * Method names that must be decorated
   */
  protected decorateList: string[] = [
    'close',
    'open',
  ];

  /**
   * Available methods
   *
   * @returns {InlineToolbar}
   */
  public get methods(): InlineToolbar {
    const methods = {
      close: (): void => this.close(),
      open: (): void => this.open(),
    };

    for (const method in methods) {
      if (this.decorateList.includes(method)) {
        methods[method] = this.Editor.ReadOnly.decorator(methods[method]);
      }
    }

    return methods;
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
