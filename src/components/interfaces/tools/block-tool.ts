import IBlockToolData from './tool-settings';
import ITool from './tool';

/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export default interface IBlockTool extends ITool {

  /**
   * Create Block's settings block
   * @return {HTMLElement}
   */
  renderSettings(): HTMLElement;

  /**
   * Return Tool's main block-wrapper
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * Process Tool's element in DOM and return raw data
   * @param {HTMLElement} block - element created by {@link IBlockTool#render} function
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
