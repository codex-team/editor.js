import Module from '../../__module';
import { Toolbar } from '../../../../types/api';

/**
 * @class ToolbarAPI
 * Provides methods for working with the Toolbar
 */
export default class ToolbarAPI extends Module {
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
   * @returns {Toolbar}
   */
  public get methods(): Toolbar {
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
