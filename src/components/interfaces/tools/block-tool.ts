import IBlockToolData from './tool-settings';
import ITool from './tool';

/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export default interface IBlockTool extends ITool {

  /**
   * Pass `true` if Tool represents decorative empty Block
   */
  contentless?: boolean;

  /**
   * Should this Tool be displayed in the Editor's Toolbox
   */
  displayInToolbox?: boolean;

  /**
   * Disable ability to replace empty Block by Toolbox
   */
  irreplaceable?: boolean;

  /**
   * String with an icon for Toolbox
   */
  toolboxIcon?: string;

  /**
   * Sanitizer rules description
   */
  sanitizer?: object;

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
   * Create Block's settings block
   * @return {HTMLElement}
   */
  renderSettings?(): HTMLElement;

  /**
   * Validate Block's data
   * @param {IBlockToolData} blockData
   * @return {boolean}
   */
  validate?(blockData: IBlockToolData): boolean;

  /**
   * Method that specified how to merge two Blocks with same type.
   * Called by backspace at the beginning of the Block
   * @param {IBlockToolData} blockData
   */
  merge?(blockData: IBlockToolData): void;
}
