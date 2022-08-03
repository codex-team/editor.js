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
   * DeleteTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api }) {
    this.api = api;
  }

  /**
   * Tune's appearance in block settings menu
   */
  public render(): PopoverItem {
    return {
      icon: $.svg('cross', 14, 14).outerHTML,
      label: this.api.i18n.t('Delete'),
      name: 'delete',
      confirmation: {
        icon: $.svg('cross', 14, 14).outerHTML,
        label: 'Click to delete',
        onActivate: (item, e): void => this.handleClick(e),
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
}
