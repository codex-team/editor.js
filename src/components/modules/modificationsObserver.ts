/**
 * @module ModificationsObserver
 *
 * Handles any mutations
 * and gives opportunity to handle outside
 */

import IEditorConfig from '../interfaces/editor-config';

import Module from '../__module';
declare const _: any;

export default class ModificationsObserver extends Module {

  /**
   * Debounce Timer
   * @type {number}
   */
  public static readonly DebounceTimer = 450;

  /**
   * Used to prevent several mutation callback execution
   * @type {Function}
   */
  private mutationDebouncer = _.debounce( () => {
    this.config.onChange.call();
  }, ModificationsObserver.DebounceTimer);

  /**
   * Constructor
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Clear timeout and set null to mutationDebouncer property
   */
  public destroy() {
    this.mutationDebouncer = null;
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
    }, 1000);
  }

  /**
   * setObserver
   *
   * sets 'DOMSubtreeModified' listener on Editor's UI.nodes.redactor
   * so that User can handle outside from API
   */
  private setObserver(): void {
    const {Listeners, UI} = this.Editor;

    /**
     * Set Listener to the Editor <div> element that holds only Blocks
     */
    Listeners.on(UI.nodes.redactor, 'DOMSubtreeModified', () => {
      this.mutationDebouncer();
    }, false);
  }
}
