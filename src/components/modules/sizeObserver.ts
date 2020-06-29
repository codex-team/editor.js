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
    /**
     * wait till Browser render Editor's Blocks
     */
    window.setTimeout( () => {
        this.setObserver();
    }, 3000);
  }

  /**
   * Set observer
   */
  private setObserver(): void {
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
     * Adjust toolbar position
     */
    this.Editor.Toolbar.move();
  }
}
