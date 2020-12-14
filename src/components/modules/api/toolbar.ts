import { Toolbar } from '../../../../types/api';
import Module from '../../__module';
import * as _ from './../../utils';
/**
 * @class ToolbarAPI
 * Provides methods for working with the Toolbar
 */
export default class ToolbarAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Toolbar}
   */
  public get methods(): Toolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
      toggleBlockSetting: (openingState?: boolean): void => this.toggleBlockSetting(openingState),
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

  /**
   * Toggles Block Setting of Current Focused Elements
   *
   * @param {boolean} openingState —  opening state of Block Setting
   */
  public toggleBlockSetting(openingState?: boolean): void {
    if (!this.Editor.BlockManager.currentBlockIndex) {
      _.logLabeled('Could\'t toggle the Toolbar because there is no block selected ', 'warn');

      return;
    }

    if (!this.Editor.Toolbar.opened) {
      this.Editor.Toolbar.open(true, false);
      this.Editor.Toolbar.plusButton.hide();
    }

    /** Check that opening state is set or not */
    const canOpenBlockSettings = (openingState !== undefined) ? openingState : !this.Editor.BlockSettings.opened;

    /** Check if state same as current state */
    if (openingState !== undefined && openingState === this.Editor.BlockSettings.opened) {
      return;
    }

    if (canOpenBlockSettings) {
      this.Editor.BlockSettings.open();
    } else {
      this.Editor.BlockSettings.close();
    }
  }
}
