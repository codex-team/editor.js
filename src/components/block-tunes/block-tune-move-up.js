/**
 *
 */
import BlockTune from './block-tune';
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
