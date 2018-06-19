/**
 * BlockTune abstract class
 *
 * All tunes must expand this class
 */
export default class BlockTune {
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
  render() { }
  /**
     * Handle click event
     * @param {Event} event
     */
  handle(event) { }
}
