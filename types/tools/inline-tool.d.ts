import {BaseTool, BaseToolConstructable} from './tool';
import {API, ToolConfig} from '../index';
/**
 * Base structure for the Inline Toolbar Tool
 */
export interface InlineTool extends BaseTool {
  /**
   * Shortcut for Tool
   * @type {string}
   */
  shortcut?: string;

  /**
   * Method that accepts selected range and wrap it somehow
   * @param {Range} range - selection's range
   */
  surround(range: Range): void;

  /**
   * Get SelectionUtils and detect if Tool was applied
   * For example, after that Tool can highlight button or show some details
   * @param {Selection} selection - current Selection
   */
  checkState(selection: Selection): boolean;

  /**
   * Make additional element with actions
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   */
  renderActions?(): HTMLElement;

  /**
   * Function called with Inline Toolbar closing
   * @deprecated 2020 10/02 - The new instance will be created each time the button is rendered. So clear is not needed.
   *                          Better to create the 'destroy' method in a future.
   */
  clear?(): void;
}


/**
 * Describe constructor parameters
 */
export interface InlineToolConstructorOptions {
  api: API;
  config?: ToolConfig;
}

export interface InlineToolConstructable extends BaseToolConstructable {
  /**
   * Constructor
   *
   * @param {InlineToolConstructorOptions} config - constructor parameters
   */
  new(config: InlineToolConstructorOptions): BaseTool;
}
