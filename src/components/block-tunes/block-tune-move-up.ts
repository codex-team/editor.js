/**
 * @class MoveUpTune
 * @classdesc Editor's default tune that moves up selected block
 */
import IBlockTune from './block-tune';

declare var $: any;
declare var _: any;

export default class MoveUpTune implements IBlockTune {

  private settings: object;

  /**
   * Styles
   * @type {{wrapper: string}}
   */
  private CSS = {
    wrapper: 'as',
  };

  /**
   * MoveUpTune constructor
   * @param {Object} settings
   */
  public constructor(settings) {
    this.settings = settings;
  }

  /**
   * Create "MoveUp" button and add click event listener
   * @returns [Element}
   */
  public render() {

    const moveUpButton = $.make('div', ['ce-settings-move-up'], {});

    moveUpButton.addEventListener('click', this.handleClick, false);
    return moveUpButton;
  }

  /**
   * Move current block up
   * @param {MouseEvent} event
   */
  public handleClick(event: MouseEvent): void {
    console.log(`mas`);
  }
}
