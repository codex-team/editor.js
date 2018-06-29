/**
 * @class MoveUpTune
 * @classdesc Editor's default tune that moves up selected block
 *
 * @copyright <CodeX Team> 2018
 */
import IBlockTune from './block-tune';

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
      moveUpButton.addEventListener('click', (event) => this.handleClick(event), false);
    }

    return moveUpButton;
  }

  /**
   * Move current block up
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent): void {
    this.api.blocks.moveUp();
  }
}
