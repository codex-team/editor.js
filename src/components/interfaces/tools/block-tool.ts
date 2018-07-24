import IBlockToolData from './tool-settings';

/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export default interface IBlockTool {

  /**
   * Should this tools be displayed at the Editor's Toolbox
   */
  displayInToolbox: boolean;

  /**
   * Class for the Toolbox icon
   */
  iconClassName: string;

  /**
   * Ability to open Toolbox and change Tool if all Block's field are empty
   */
  irreplaceable?: boolean;

  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

  /**
   * Allow Tool to determine shortcut that will fire 'surround' method
   */
  shortcut?: string;

  /**
   * Tool's SVG icon for Toolbox
   */
  toolboxIcon: string;

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
