/**
 * @class DeleteTune
 * @classdesc Editor's default tune that moves up selected block
 * @copyright <CodeX Team> 2018
 */
import { API, BlockTune, PopoverItem } from '../../../types';
import $ from '../dom';

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
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      icon: $.svg('cross', 14, 14).outerHTML,
      label: this.api.i18n.t('Delete'),
      name: 'delete',
      confirmation: {
        label: this.api.i18n.t('Click to delete'),
        onActivate: (): void => this.handleClick(),
      },
    };
  }

  /**
   * Delete block conditions passed
   */
  public handleClick(): void {
    this.api.blocks.delete();
  }
}
