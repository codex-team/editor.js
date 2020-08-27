import {API} from '../index';
import {ToolConfig} from './tool-config';
import {SanitizerConfig} from '../configs';

/**
 * Abstract interface of all Tools
 */
export interface BaseTool {
  /**
   * Tool`s render method
   * For inline Tools returns inline toolbar button
   * For block Tools returns tool`s wrapper
   */
  render(): HTMLElement;
}

export interface BaseToolConstructable {
  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

  /**
   * Tool`s sanitizer configuration
   */
  sanitize?: SanitizerConfig;

  /**
   * Title of Inline Tool
   */
  title?: string;

  /**
   * Describe constructor parameters
   */
  new (config: {api: API, config?: ToolConfig}): BaseTool;

  /**
   * Tool`s prepare method. Can be async
   * @param data
   */
  prepare?(data: {toolName: string, config: ToolConfig}): void | Promise<void>;

  /**
   * Tool`s reset method to clean up anything set by prepare. Can be async
   */
  reset?(): void | Promise<void>;
}
