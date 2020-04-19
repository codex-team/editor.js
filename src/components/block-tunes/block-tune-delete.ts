/**
 * @class DeleteTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import { API, BlockTune } from '../../../types';
import $ from '../dom';

/**
 *
 */
export default class DeleteTune implements BlockTune {
  /**
   * Property that contains Editor.js API methods
   *
   * @see {@link docs/api.md}
   */
  private readonly api: API;

  /**
   * Styles
   */
  private CSS = {
    button: 'ce-settings__button',
    buttonDelete: 'ce-settings__button--delete',
    buttonConfirm: 'ce-settings__button--confirm',
  };

  /**
   * Delete confirmation
   */
  private needConfirmation: boolean;

  /**
   * set false confirmation state
   */
  private readonly resetConfirmation: () => void;

  /**
   * Tune nodes
   */
  private nodes: {button: HTMLElement} = {
    button: null,
  };

  /**
   * DeleteTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api }) {
    this.api = api;

    this.resetConfirmation = (): void => {
      this.setConfirmation(false);
    };
  }

  /**
   * Create "Delete" button and add click event listener
   *
   * @returns {HTMLElement}
   */
  public render(): HTMLElement {
    this.nodes.button = $.make('div', [this.CSS.button, this.CSS.buttonDelete], {});
    this.nodes.button.appendChild($.svg('cross', 12, 12));
    this.api.listeners.on(this.nodes.button, 'click', (event: MouseEvent) => this.handleClick(event), false);

    /**
     * Enable tooltip module
     */
    this.api.tooltip.onHover(this.nodes.button, this.api.i18n.t('Delete'));

    return this.nodes.button;
  }

  /**
   * Delete block conditions passed
   *
   * @param {MouseEvent} event - click event
   */
  public handleClick(event: MouseEvent): void {
    /**
     * if block is not waiting the confirmation, subscribe on block-settings-closing event to reset
     * otherwise delete block
     */
    if (!this.needConfirmation) {
      this.setConfirmation(true);

      /**
       * Subscribe on event.
       * When toolbar block settings is closed but block deletion is not confirmed,
       * then reset confirmation state
       */
      this.api.events.on('block-settings-closed', this.resetConfirmation);
    } else {
      /**
       * Unsubscribe from block-settings closing event
       */
      this.api.events.off('block-settings-closed', this.resetConfirmation);

      this.api.blocks.delete();
      this.api.toolbar.close();
      this.api.tooltip.hide();

      /**
       * Prevent firing ui~documentClicked that can drop currentBlock pointer
       */
      event.stopPropagation();
    }
  }

  /**
   * change tune state
   *
   * @param {boolean} state - delete confirmation state
   */
  private setConfirmation(state: boolean): void {
    this.needConfirmation = state;
    this.nodes.button.classList.add(this.CSS.buttonConfirm);
  }
}
