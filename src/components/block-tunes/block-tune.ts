/**
 * BlockTune abstract class
 *
 * All tunes must expand this class
 */
export default class BlockTune {

  state: any;

  /**
   * Tune's state
   * @param {Object} state
   */
  constructor(state) {
    this.state = state;
  }

  /**
   * @return {Element}
   */
  render() {}

  /**
   * Handle click event
   * @param {Event} event
   */
  handle(event) {}
}
