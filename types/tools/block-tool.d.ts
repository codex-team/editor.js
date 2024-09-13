import { ConversionConfig, PasteConfig, SanitizerConfig } from '../configs';
import { BlockToolData } from './block-tool-data';
import { BaseTool, BaseToolConstructable, BaseToolConstructorOptions } from './tool';
import { ToolConfig } from './tool-config';
import { API, BlockAPI, ToolboxConfig } from '../index';
import { PasteEvent } from './paste-events';
import { MoveEvent } from './hook-events';
import { MenuConfig } from './menu-config';

/**
 * Describe Block Tool object
 * @see {@link docs/tools.md}
 */
export interface BlockTool extends BaseTool {
  /**
   * Sanitizer rules description
   */
  sanitize?: SanitizerConfig;

  /**
   * Process Tool's element in DOM and return raw data
   * @param {HTMLElement} block - element created by {@link BlockTool#render} function
   * @return {BlockToolData}
   */
  save(block: HTMLElement): BlockToolData;

  /**
   * Create Block's settings block
   */
  renderSettings?(): HTMLElement | MenuConfig;

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

  /**
   * On paste callback. Fired when pasted content can be substituted by a Tool
   * @param {PasteEvent} event
   */
  onPaste?(event: PasteEvent): void;

  /**
   * Cleanup resources used by your tool here
   * Called when the editor is destroyed
   */
  destroy?(): void;

  /**
   * Lifecycle hooks
   */

  /**
   * Called after block content added to the page
   */
  rendered?(): void;

  /**
   * Called each time block content is updated
   */
  updated?(): void;

  /**
   * Called after block removed from the page but before instance is deleted
   */
  removed?(): void;

  /**
   * Called after block was moved
   */
  moved?(event: MoveEvent): void;
}

/**
 * Describe constructor parameters
 */
export interface BlockToolConstructorOptions<D extends object = any, C extends object = any> extends BaseToolConstructorOptions<C> {
  data: BlockToolData<D>;
  block: BlockAPI;
  readOnly: boolean;
}

export interface BlockToolConstructable extends BaseToolConstructable {
  /**
   * Tool's Toolbox settings
   */
  toolbox?: ToolboxConfig;

  /**
   * Paste substitutions configuration
   */
  pasteConfig?: PasteConfig | false;

  /**
   * Rules that specified how this Tool can be converted into/from another Tool
   */
  conversionConfig?: ConversionConfig;

  /**
   * Is Tool supports read-only mode, this property should return true
   */
  isReadOnlySupported?: boolean;

  /**
   * @constructor
   *
   * @param {BlockToolConstructorOptions} config - constructor parameters
   *
   * @return {BlockTool}
   */
  new(config: BlockToolConstructorOptions): BlockTool;
}
