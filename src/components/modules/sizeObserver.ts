/**
 * @module ResizeObserver
 *
 * Handles any resizes
 */

import Module from '../__module';
import * as _ from '../utils';

export default class SizeObserver extends Module {

  /**
   * ResizeObserver instance
   */
  // @ts-ignore
  private observer: ResizeObserver;

  /**
   * Disconnect ResizeObserver
   */
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = null;
  }

  /**
   * Preparation method
   * @return {Promise<void>}
   */
  public async prepare(): Promise<void> {
    if (!('ResizeObserver' in window)) {
      return ;
    }

    const {UI} = this.Editor;

    // @ts-ignore
    this.observer = new ResizeObserver(() => {
      this.resizeHandler();
    });
    this.observer.observe(UI.nodes.redactor);
  }

  /**
   * ResizeObserver events handler
   */
  private resizeHandler() {
    /**
     * Wait till Browser render Editor's Blocks
     */
    if (!this.Editor.BlockManager.currentBlock) {
      return ;
    }

    /**
     * Adjust toolbar position
     */
    this.Editor.Toolbar.move();
  }
}
