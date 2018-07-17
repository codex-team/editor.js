/**
 * Describe Block Tool object
 */
export default interface IBlockTool {

  /**
   * Should this tools be displayed at the Editor's Toolbox
   * @return {boolean}
   */
  displayInToolbox(): boolean;

  /**
   * Class for the Toolbox icon
   * @return {string}
   */
  iconClassName(): string;

  /**
   * Create Block's settings block
   * @return {HTMLElement}
   */
  makeSettings(): HTMLElement;

  /**
   * Return Tool's main block-wrapper
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * Process Tool's element in DOM and return raw data
   * @param {HTMLElement} block - element created by render() function
   * @return {IBlockToolData}
   */
  save(block: HTMLElement): IBlockToolData;

  /**
   * Method that specified how to merge two Text blocks.
   * Called by CodeX Editor by backspace at the beginning of the Block
   * @param {IBlockToolData} blockData
   */
  merge(blockData: IBlockToolData): void;

  /**
   * Validate Block's data
   * @param {IBlockToolData} blockData
   * @return {boolean}
   */
  validate(blockData: IBlockToolData): boolean;
}

interface IBlockToolData {}

interface IBlockToolConfig {}
