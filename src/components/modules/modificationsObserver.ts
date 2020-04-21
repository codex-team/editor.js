/**
 * @module ModificationsObserver
 *
 * Handles any mutations
 * and gives opportunity to handle outside
 */

import Module from '../__module';
import * as _ from '../utils';
import Block from '../block';

/**
 *
 */
export default class ModificationsObserver extends Module {
  /**
   * Debounce Timer
   *
   * @type {number}
   */
  public static readonly DebounceTimer = 450;

  /**
   * MutationObserver instance
   */
  private observer: MutationObserver;

  /**
   * Allows to temporary disable mutations handling
   */
  private disabled: boolean;

  /**
   * Used to prevent several mutation callback execution
   *
   * @type {Function}
   */
  private mutationDebouncer = _.debounce(() => {
    this.updateNativeInputs();
    this.config.onChange(this.Editor.API.methods);
  }, ModificationsObserver.DebounceTimer);

  /**
   * Array of native inputs in Blocks.
   * Changes in native inputs are not handled by modification observer, so we need to set change event listeners on them
   */
  private nativeInputs: HTMLElement[] = [];

  /**
   * Clear timeout and set null to mutationDebouncer property
   */
  public destroy(): void {
    this.mutationDebouncer = null;
    if (this.observer) {
      this.observer.disconnect();
    }
    this.observer = null;
    this.nativeInputs.forEach((input) => this.Editor.Listeners.off(input, 'input', this.mutationDebouncer));
  }

  /**
   * Preparation method
   *
   * @returns {Promise<void>}
   */
  public async prepare(): Promise<void> {
    /**
     * wait till Browser render Editor's Blocks
     */
    window.setTimeout(() => {
      this.setObserver();
    }, 1000);
  }

  /**
   * Allows to disable observer,
   * for example when Editor wants to stealthy mutate DOM
   */
  public disable(): void {
    this.disabled = true;
  }

  /**
   * Enables mutation handling
   * Should be called after .disable()
   */
  public enable(): void {
    this.disabled = false;
  }

  /**
   * setObserver
   *
   * sets 'DOMSubtreeModified' listener on Editor's UI.nodes.redactor
   * so that User can handle outside from API
   */
  private setObserver(): void {
    const { UI } = this.Editor;
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
   *
   * @param {MutationRecord[]} mutationList - list of mutations
   * @param {MutationObserver} observer - observer instance
   */
  private mutationHandler(mutationList: MutationRecord[], observer): void {
    /**
     * Skip mutations in stealth mode
     */
    if (this.disabled) {
      return;
    }

    /**
     * We divide two Mutation types:
     * 1) mutations that concerns client changes: settings changes, symbol added, deletion, insertions and so on
     * 2) functional changes. On each client actions we set functional identifiers to interact with user
     */
    let contentMutated = false;

    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'childList':
        case 'characterData':
          contentMutated = true;
          break;
        case 'attributes':
          /**
           * Changes on Element.ce-block usually is functional
           */
          if (!(mutation.target as Element).classList.contains(Block.CSS.wrapper)) {
            contentMutated = true;
          }
          break;
      }
    });

    /** call once */
    if (contentMutated) {
      this.mutationDebouncer();
    }
  }

  /**
   * Gets native inputs and set oninput event handler
   */
  private updateNativeInputs(): void {
    if (this.nativeInputs) {
      this.nativeInputs.forEach((input) => {
        this.Editor.Listeners.off(input, 'input');
      });
    }

    this.nativeInputs = Array.from(this.Editor.UI.nodes.redactor.querySelectorAll('textarea, input, select'));

    this.nativeInputs.forEach((input) => this.Editor.Listeners.on(input, 'input', this.mutationDebouncer));
  }
}
