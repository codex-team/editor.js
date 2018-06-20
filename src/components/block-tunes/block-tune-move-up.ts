/**
 * @class MoveUpTune
 * @classdesc Editor's default tune that moves up selected block
 */
import BlockTune from './block-tune';

declare var $: any;
declare var _: any;

/**
 * CSS classes interface
 */
interface ICSS {
  wrapper: string;
  icon: string;
}

export default class MoveUpTune extends BlockTune {
  constructor(state) {
    super(state);
  }

  private CSS: ICSS = {
    wrapper: '',
    icon: ''
  };

  /**
   * Create "MoveUp" button and add click event listener
   * @returns [Element}
   */
  render() {

    let moveUpButton = $.make('div', [], {});

    moveUpButton.addEventListener('click', this.handle, false);
    return moveUpButton;
  }

  /**
   * Move current block up
   * @param {Event} event
   */
  handle(event) {
    console.log("hey");
  }
}
