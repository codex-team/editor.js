/**
 * @module ModificationsObserver
 *
 * Handles any mutations
 * and gives opportunity to handle outside
 */

import Module from '../__module';
import _ from '../utils';
import Block from '../block';

export default class ModificationsObserver extends Module {

  /**
   * Debounce Timer
   * @type {number}
   */
  public static readonly DebounceTimer = 450;

  /**
   * MutationObserver instance
   */
  private observer: MutationObserver;

  /**
   * Used to prevent several mutation callback execution
   * @type {Function}
   */
  private mutationDebouncer = _.debounce( () => {
    this.config.onChange();
  }, ModificationsObserver.DebounceTimer);

  /**
   * Clear timeout and set null to mutationDebouncer property
   */
  public destroy() {
    this.mutationDebouncer = null;
    this.observer.disconnect();
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
    }, 1000);
  }

  /**
   * setObserver
   *
   * sets 'DOMSubtreeModified' listener on Editor's UI.nodes.redactor
   * so that User can handle outside from API
   */
  private setObserver(): void {
    const {UI} = this.Editor;
    const observerOptions = {
      childList: true,
      attributes: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    };

    this.observer = new MutationObserver((mutationList, observer) => {
      this.mutationHandler(mutationList, observer);
    });
    this.observer.observe(UI.nodes.redactor, observerOptions);
  }

  /**
   * MutationObserver events handler
   * @param mutationList
   * @param observer
   */
  private mutationHandler(mutationList, observer) {
    /**
     * We divide two Mutation types:
     * 1) we mutations concerns client changes. For example, settings changes, symbol added, deletion, insertions and so on
     * 2) functional changes. On each client actions we set functional identifiers to interact with user
     */
    let contentMutated = false;

    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'childList':
        case 'subtree':
        case 'characterData':
        case 'characterDataOldValue':
          contentMutated = true;
          break;
        case 'attributes':
          const mutatedTarget = mutation.target as Element;

          /**
           * Changes on Element.ce-block usually is functional
           */
          if (!mutatedTarget.classList.contains(Block.CSS.wrapper)) {
            contentMutated = true;
            return;
          }
          break;
      }
    });

    /** call once */
    if (contentMutated) {
      this.mutationDebouncer();
    }
  }
}
