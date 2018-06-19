/**
 *
 */
import BlockTune from './block-tune';

declare var $: any;
declare var _: any;

/**
 *
 */
export default class MoveUpTune extends BlockTune {
  constructor(state) {
    super(state);
  }

  /**
   * @returns [Element}
   */
  render() {

    let moveUpButton = $.make('div', [], {
      textContent: 'Her'
    });

    return moveUpButton;
  }
}
