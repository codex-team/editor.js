import {BaseTool, BaseToolConstructable} from './tool';
import {API, ToolConfig} from '../index';
import { MenuConfig } from './menu-config';
/**
 * Base structure for the Inline Toolbar Tool
 */
export interface InlineTool extends BaseTool<HTMLElement | MenuConfig> {
  /**
   * Shortcut for Tool
   * @type {string}
   */
  shortcut?: string;

  /**
   * Method that accepts selected range and wrap it somehow
   * @param range - selection's range. If no active selection, range is null
   * @deprecated use {@link MenuConfig} item onActivate property instead
   */
  surround?(range: Range | null): void;

  /**
   * Get SelectionUtils and detect if Tool was applied
   * For example, after that Tool can highlight button or show some details
   * @param {Selection} selection - current Selection
   * @deprecated use {@link MenuConfig} item isActive property instead
   */
  checkState?(selection: Selection): boolean;

  /**
   * Make additional element with actions
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   * @deprecated use {@link MenuConfig} item children to set item actions instead
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
