import IBlockToolData from './tool-settings';
import {PasteConfig} from '../../src/components/modules/paste';
import {BlockToolData} from './block-tool-data';
import Tool, {ToolConstructable} from './tool';
import {ToolConfig} from './tool-config';
import * as API from '../api/index';
/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export interface BlockTool extends Tool {
  /**
   * Sanitizer rules description
   */
  sanitize?: object;

  constructor: BlockToolConstructable;

  /**
   * Return Tool's main block-wrapper
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * Process Tool's element in DOM and return raw data
   * @param {HTMLElement} block - element created by {@link BlockTool#render} function
   * @return {IBlockToolData}
   */
  save(block: HTMLElement): BlockToolData;

  /**
   * Create Block's settings block
   * @return {HTMLElement}
   */
  renderSettings?(): HTMLElement;

  /**
   * Validate Block's data
   * @param {BlockToolData} blockData
   * @return {boolean}
   */
  validate?(blockData: BlockToolData): boolean;

  /**
   * Method that specified how to merge two Blocks with same type.
   * Called by backspace at the beginning of the Block
   * @param {BlockToolData} blockData
   */
  merge?(blockData: BlockToolData): void;
}

export interface BlockToolConstructable extends ToolConstructable {
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
   * Paste substitutions configuration
   */
  onPaste?: PasteConfig;

  new (config: {api: API, config: ToolConfig, data: BlockToolData}): BlockTool;
}
