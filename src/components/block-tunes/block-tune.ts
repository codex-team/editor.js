/**
 * BlockTune interface
 *
 * All tunes must implement this interface
 */
export default interface IBlockTune {

  /**
   * Settings will be described later
   */
  settings?: object;

  /**
   * Returns tune button that will be appended in default settings area
   */
  render(): HTMLElement;

  /**
   * handle Click event
   * @param {MouseEvent} event
   */
  handleClick(event: MouseEvent): void;
}
