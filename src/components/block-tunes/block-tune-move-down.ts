/**
 * @class MoveDownTune
 * @classdesc Editor's default tune - Moves down highlighted block
 *
 * @copyright <CodeX Team> 2018
 */

import $ from '../dom';
import {API, BlockTune} from '../../../types';

export default class MoveDownTune implements BlockTune {
  /**
   * Property that contains CodeX Editor API methods
   * @see {api.md}
   */
  private readonly api: API;

  /**
   * Styles
   * @type {{wrapper: string}}
   */
  private CSS = {
    button: 'ce-settings__button',
    wrapper: 'ce-tune-move-down',
    animation: 'wobble',
  };

  /**
   * MoveDownTune constructor
   *
   * @param {{api: API}} api
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
    this.api.listeners.add(
      moveDownButton,
      'click',
      (event) => this.handleClick(event as MouseEvent, moveDownButton),
      false,
    );
    return moveDownButton;
  }

  /**
   * Handle clicks on 'move down' button
   * @param {MouseEvent} event
   * @param {HTMLElement} button
   */
  public handleClick(event: MouseEvent, button: HTMLElement) {

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    // If Block is last do nothing
    if (currentBlockIndex === this.api.blocks.getBlocksCount() - 1) {
      button.classList.add(this.CSS.animation);

      window.setTimeout( () => {
        button.classList.remove(this.CSS.animation);
      }, 500);
      return;
    }

    const nextBlockElement = this.api.blocks.getBlockByIndex(currentBlockIndex + 1);
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
    this.api.blocks.swap(currentBlockIndex, currentBlockIndex + 1);

  }
}
