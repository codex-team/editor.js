export default interface IBlockTool {
  /**
   * Should this tools be displayed at the Editor's Toolbox
   */
  displayInToolbox(): boolean;

  /**
   * Class for the Toolbox icon
   * @return {string}
   */
  iconClassName(): string;

  /**
   * Create Block's settings block
   */
  makeSettings(): HTMLElement;

  /**
   * Return Tool's view
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * todo define type for block's output data
   * @return {object}
   */
  save(block: HTMLElement): object;

  /**
   * Method that specified how to merge two Text blocks.
   * Called by CodeX Editor by backspace at the beginning of the Block
   *
   * todo define type for block's input data
   */
  merge(blockData): void;

  /**
   * Validate Block's data
   */
  validate(blockData): boolean;
}
