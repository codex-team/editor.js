import {PasteConfig, SanitizerConfig} from '../configs';
import {BlockToolData} from './block-tool-data';
import {Tool, ToolConstructable} from './tool';
import {ToolConfig} from './tool-config';
import {API} from '../index';
import {PasteEvent} from './paste-events';
/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export interface BlockTool extends Tool {
  /**
   * Sanitizer rules description
   */
  sanitize?: SanitizerConfig;

  /**
   * Return Tool's main block-wrapper
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * Process Tool's element in DOM and return raw data
   * @param {HTMLElement} block - element created by {@link BlockTool#render} function
   * @return {BlockToolData}
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

  onPaste?(event: PasteEvent);
}

export interface BlockToolConstructable extends ToolConstructable {
  /**
   * Tool's Toolbox settings
   */
  toolbox?: {
    /**
     * HTML string with an icon for Toolbox
     */
    icon: string;

    /**
     * Tool title for Toolbox
     */
    title?: string;
  };

  /**
   * Paste substitutions configuration
   */
  pasteConfig?: PasteConfig;

  new (config: {api: API, config: ToolConfig, data: BlockToolData}): BlockTool;
}
