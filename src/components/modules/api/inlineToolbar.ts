import Module from '../../__module';
import { InlineToolbar } from '../../../../types/api/inline-toolbar';

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
 */
export default class InlineToolbarAPI extends Module {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  protected methodsToDisableInReadonly: string[] = [
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
      if (this.methodsToDisableInReadonly.includes(method)) {
        methods[method] = this.Editor.ReadOnly.offDecorator(methods[method]);
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
