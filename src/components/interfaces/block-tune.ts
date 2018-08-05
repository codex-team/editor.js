export interface IBlockTuneConstructor {
  new (data: {api: any, settings: any});
}

/**
 * BlockTune interface
 *
 * All tunes must implement this interface
 */
export interface IBlockTune {
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
   * @param {HTMLElement} button
   */
  handleClick(event: MouseEvent, button: HTMLElement): void;
}

export default IBlockTune;
