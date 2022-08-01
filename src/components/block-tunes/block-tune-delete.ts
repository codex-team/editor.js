/**
 * @class DeleteTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import { API, BlockTune } from '../../../types';
import $ from '../dom';
import Popover, { PopoverItem } from '../utils/popover';

/**
 *
 */
export default class DeleteTune implements BlockTune {
  /**
   * Set Tool is Tune
   */
  public static readonly isTune = true;

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
   * Tune's appearance in block settings menu
   */
  public render(): PopoverItem {
    return {
      icon: $.svg('cross', 14, 14).outerHTML,
      label: this.api.i18n.t('Delete'),
      onClick: (item, e): void => this.handleClick(e),
      name: 'delete',
      confirmation: {
        label: 'Click to delete',
      },
    };
  }

  /**
   * Delete block conditions passed
   *
   * @param {MouseEvent} event - click event
   */
  public handleClick(event: MouseEvent): void {
    this.api.blocks.delete();
    this.api.toolbar.close();
    this.api.tooltip.hide();

    /**
     * Prevent firing ui~documentClicked that can drop currentBlock pointer
     */
    event.stopPropagation();
  }

  /**
   * change tune state
   *
   * @param {boolean} state - delete confirmation state
   */
  private setConfirmation(state: boolean): void {
    this.needConfirmation = state;
  }
}
