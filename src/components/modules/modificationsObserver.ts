import Module from '../__module';
import { BlockAPI } from '../../../types';
import * as _ from '../utils';

/**
 * Single entry point for Block mutation events
 */
export default class ModificationsObserver extends Module {
  /**
   * Flag shows onChange event is disabled
   */
  private disabled = false;

  /**
   * Enables onChange event
   */
  public enable(): void {
    this.disabled = false;
  }

  /**
   * Disables onChange event
   */
  public disable(): void {
    this.disabled = true;
  }

  /**
   * Call onChange event passed to Editor.js configuration
   *
   * @param block - changed Block
   */
  public onChange(block: BlockAPI): void {
    if (this.disabled || !_.isFunction(this.config.onChange)) {
      return;
    }

    this.config.onChange(this.Editor.API.methods, block);
  }
}
