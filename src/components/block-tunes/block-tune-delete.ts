/**
 * @class DeleteTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import { API, BlockTune, PopoverItem } from '../../../types';
import { IconCross } from '@codexteam/icons';

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
      icon: IconCross,
      label: this.api.i18n.t('Delete'),
      name: 'delete',
      confirmation: {
        label: this.api.i18n.t('Click to delete'),
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
  }
}
