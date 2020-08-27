import Module from '../../__module';
import { Toolbar } from '../../../../types/api';

/**
 * @class ToolbarAPI
 * Provides methods for working with the Toolbar
 */
export default class ToolbarAPI extends Module {
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
   * @returns {Toolbar}
   */
  public get methods(): Toolbar {
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
