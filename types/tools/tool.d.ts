import * as API from '../api/index';
import {ToolConfig} from './tool-config';
import {SanitizerConfig} from '../configs';

/**
 * Abstract interface of all Tools
 */
export interface Tool {
  /**
   * Tool`s render method
   * For inline Tools returns inline toolbar button
   * For block Tools returns tool`s wrapper
   */
  render(): HTMLElement;
}

export interface ToolConstructable {
  /**
   * Tool name
   */
  name: string;

  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

  sanitize?: SanitizerConfig;

  new (config: {api: API}): Tool;

  /**
   * Tool`s prepare method. Can be async
   * @param data
   */
  prepare?(data: {toolName: string, config: ToolConfig}): void | Promise<void>;
}
