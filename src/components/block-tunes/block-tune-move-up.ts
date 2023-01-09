/**
 * @class MoveUpTune
 * @classdesc Editor's default tune that moves up selected block
 * @copyright <CodeX Team> 2018
 */
import { API, BlockTune } from '../../../types';
import Popover from '../../components/utils/popover';
import { IconChevronUp } from '@codexteam/icons';
import { TunesMenuConfig } from '../../../types/tools';

/**
 *
 */
export default class MoveUpTune implements BlockTune {
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
   * MoveUpTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api }) {
    this.api = api;
  }

  /**
   * Tune's appearance in block settings menu
   */
  public render(): TunesMenuConfig {
    return {
      icon: IconChevronUp,
      title: this.api.i18n.t('Move up'),
      onActivate: (item, e): void => this.handleClick(e),
      name: 'move-up',
    };
  }

  /**
   * Move current block up
   *
   * @param {MouseEvent} event - click event
   */
  public handleClick(event: MouseEvent): void {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
    const previousBlock = this.api.blocks.getBlockByIndex(currentBlockIndex - 1);

    if (currentBlockIndex === 0 || !currentBlock || !previousBlock) {
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

    const currentBlockElement = currentBlock.holder;
    const previousBlockElement = previousBlock.holder;

    /**
     * Here is two cases:
     *  - when previous block has negative offset and part of it is visible on window, then we scroll
     *  by window's height and add offset which is mathematically difference between two blocks
     *
     *  - when previous block is visible and has offset from the window,
     *      than we scroll window to the difference between this offsets.
     */
    const currentBlockCoords = currentBlockElement.getBoundingClientRect(),
        previousBlockCoords = previousBlockElement.getBoundingClientRect();

    let scrollUpOffset;

    if (previousBlockCoords.top > 0) {
      scrollUpOffset = Math.abs(currentBlockCoords.top) - Math.abs(previousBlockCoords.top);
    } else {
      scrollUpOffset = window.innerHeight - Math.abs(currentBlockCoords.top) + Math.abs(previousBlockCoords.top);
    }

    window.scrollBy(0, -1 * scrollUpOffset);

    /** Change blocks positions */
    this.api.blocks.move(currentBlockIndex - 1);

    this.api.toolbar.toggleBlockSettings(true);
  }
}
