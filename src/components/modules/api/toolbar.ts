import Module from '../../__module';
import {Toolbar} from '../../../../types/api';

/**
 * @class ToolbarAPI
 * provides with methods working with Toolbar
 */
export default class ToolbarAPI extends Module {
  /**
   * Available methods
   * @return {Toolbar}
   */
  get methods(): Toolbar {
    return {
      close: () => this.close(),
      open: () => this.open(),
      on: (event: string, callback: (data: any) => void) => this.Editor.Toolbar.on(event, callback),
      off: (event: string, callback: (data: any) => void) => this.Editor.Toolbar.off(event, callback),
    } as Toolbar;
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
