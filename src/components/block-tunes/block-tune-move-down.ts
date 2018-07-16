/**
 * @class MoveDownTune
 * @classdesc Editor's default tune - Moves down highlighted block
 *
 * @copyright <CodeX Team> 2018
 */
import IBlockTune from '../interfaces/block-tune';

declare var $: any;
declare var _: any;

export default class MoveDownTune implements IBlockTune {
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
    btnDisabled: 'ce-settings__button--disabled',
    wrapper: 'ce-tune-move-down',
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
   * Return 'move down' button
   */
  public render() {
    const moveDownButton = $.make('div', [this.CSS.button, this.CSS.wrapper], {});
    moveDownButton.appendChild($.svg('arrow-down', 14, 14));
    if (this.api.blocks.getCurrentBlockIndex() === 0) {
      moveDownButton.classList.add(this.CSS.btnDisabled);
    } else {
      this.api.listener.on(moveDownButton, 'click', (event) => this.handleClick(event), false);
    }

    return moveDownButton;
  }

  /**
   * Handle clicks on 'move down' button
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent) {

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    const nextBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex + 1).html,
        nextBlockCoords = nextBlockElement.getBoundingClientRect();

    let scrollOffset;

    /**
     * Next block ends on screen.
     * Increment scroll by next block's height to save element onscreen-position
     */
    if (nextBlockCoords.top < window.innerHeight) {

      scrollOffset = window.scrollY + nextBlockElement.offsetHeight;

      /**
       * Next block ends belows the screen.
       * Increment scroll by next block's hidden height
       */

    } else {

      scrollOffset = Math.abs(window.innerHeight - nextBlockElement.offsetHeight);

    }

    window.scrollTo(0, scrollOffset);

    /** Change blocks positions */
    this.api.blocks.swap(currentBlockIndex, currentBlockIndex + 1);

  }
}
