/**
 * @class MoveUpTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import IBlockTune from '../interfaces/block-tune';

declare var $: any;
declare var _: any;

export default class MoveUpTune implements IBlockTune {

  /**
   * Property that contains CodeX Editor API methods
   * @see {api.md}
   */
  private readonly api: any;

  /**
   * Styles
   * @type {{wrapper: string}}
   */
  private CSS = {
    button: 'ce-settings__button',
    wrapper: 'ce-settings-move-up',
    btnDisabled: 'ce-settings-move-up--disabled',
  };

  /**
   * MoveUpTune constructor
   *
   * @param {Object} api
   */
  public constructor({api}) {
    this.api = api;
  }

  /**
   * Create "MoveUp" button and add click event listener
   * @returns [Element}
   */
  public render() {
    const moveUpButton = $.make('div', [this.CSS.button, this.CSS.wrapper], {});
    moveUpButton.appendChild($.svg('arrow-up', 14, 14));
    if (this.api.blocks.getCurrentBlockIndex() === 0) {
      moveUpButton.classList.add(this.CSS.btnDisabled);
    } else {
      this.api.listener.on(moveUpButton, 'click', (event) => this.handleClick(event), false);
    }

    return moveUpButton;
  }

  /**
   * Move current block up
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent): void {

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if (currentBlockIndex === 0) {
      return;
    }

    const currentBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex).html,
      previousBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex - 1).html;

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
    this.api.blocks.swap(currentBlockIndex, currentBlockIndex - 1);
  }
}
