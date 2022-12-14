/**
 * @class MoveDownTune
 * @classdesc Editor's default tune - Moves down highlighted block
 * @copyright <CodeX Team> 2018
 */

import { API, BlockTune } from '../../../types';
import Popover from '../utils/popover';
import { IconChevronDown } from '@codexteam/icons';
import { TunesMenuConfig } from '../../../types/tools';


/**
 *
 */
export default class MoveDownTune implements BlockTune {
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
    animation: 'wobble',
  };

  /**
   * MoveDownTune constructor
   *
   * @param {API} api — Editor's API
   */
  constructor({ api }) {
    this.api = api;
  }

  /**
   * Tune's appearance in block settings menu
   */
  public render(): TunesMenuConfig {
    return {
      icon: IconChevronDown,
      title: this.api.i18n.t('Move down'),
      onActivate: (item, event): void => this.handleClick(event),
      name: 'move-down',
    };
  }

  /**
   * Handle clicks on 'move down' button
   *
   * @param event - click event
   */
  public handleClick(event: MouseEvent): void {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const nextBlock = this.api.blocks.getBlockByIndex(currentBlockIndex + 1);

    // If Block is last do nothing
    if (!nextBlock) {
      const button = (event.target as HTMLElement)
        .closest('.' + Popover.CSS.item)
        .querySelector('.' + Popover.CSS.itemIcon);

      button.classList.add(this.CSS.animation);

      window.setTimeout(() => {
        button.classList.remove(this.CSS.animation);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 500);

      return;
    }

    const nextBlockElement = nextBlock.holder;
    const nextBlockCoords = nextBlockElement.getBoundingClientRect();

    let scrollOffset = Math.abs(window.innerHeight - nextBlockElement.offsetHeight);

    /**
     * Next block ends on screen.
     * Increment scroll by next block's height to save element onscreen-position
     */
    if (nextBlockCoords.top < window.innerHeight) {
      scrollOffset = window.scrollY + nextBlockElement.offsetHeight;
    }

    window.scrollTo(0, scrollOffset);

    /** Change blocks positions */
    this.api.blocks.move(currentBlockIndex + 1);

    this.api.toolbar.toggleBlockSettings(true);
  }
}
