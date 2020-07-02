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
   * setObserver timeout ID
   */
  private setObserverID?: number;

  /**
   * Disconnect ResizeObserver
   */
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = null;

    window.clearTimeout(this.setObserverID);
  }

  /**
   * Preparation method
   * @return {Promise<void>}
   */
  public async prepare(): Promise<void> {
    /**
     * wait till Browser render Editor's Blocks
     */
    this.setObserverID = window.setTimeout( () => {
        this.setObserver();
    }, 1000);
  }

  /**
   * Set observer
   */
  private setObserver(): void {
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
     * Adjust toolbar position
     */
    this.Editor.Toolbar.move();
  }
}
