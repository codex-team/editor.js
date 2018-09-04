/**
 * @module ModificationsObserver
 *
 * Handles any mutations
 * and gives opportunity to handle outside
 */

import IEditorConfig from '../interfaces/editor-config';

declare const Module: any;

export default class ModificationsObserver extends Module {

  /**
   * Debounce Timer
   * @type {number}
   */
  public static readonly DebounceTimer = 450;

  /**
   * Constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});

    /**
     * Used to prevent several mutation callback execution
     * @type {null}
     */
    this.mutationDebouncer = null;
  }

  /**
   * Preparation method
   * @return {Promise<void>}
   */
  public async prepare(): Promise<void> {

    window.setTimeout( () => {
      this.setObserver();
    }, 1000);

  }

  /**
   * setObserver
   */
  private setObserver(): void {
    const {Listeners, UI} = this.Editor;

    /**
     * Set Listener to the Editor <div> element that holds only Blocks
     */
    Listeners.on(UI.nodes.redactor, 'DOMSubtreeModified', (event) => {

      this.contentModified(event);

    }, false);
  }

  /**
   * Dom SubtreeModifications
   * When something inside Editor's content area changed
   * @param {MutationEvent} event
   */
  private contentModified(event) {

    /**
     * If timeout exist clear it and create new one
     */
    if (this.mutationDebouncer) {

      window.clearTimeout(this.mutationDebouncer);

    }

    /**
     * Call User onChange method after timeout
     * @type {number}
     */
    this.mutationDebouncer = window.setTimeout( () => {

      this.config.onChange.call(event);

    }, ModificationsObserver.DebounceTimer);
  }
}
