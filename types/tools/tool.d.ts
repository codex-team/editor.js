import {API} from '../index';
import {ToolConfig} from './tool-config';
import {SanitizerConfig} from '../configs';

/**
 * Abstract interface of all Tools
 */
export interface BaseTool<RenderReturnType = HTMLElement> {
  /**
   * Tool`s render method
   * 
   * For Inline Tools may return either HTMLElement (@deprecated) or MenuConfig (@see https://editorjs.io/menu-config/)
   * For Block Tools returns tool`s wrapper html element
   */
  render(): RenderReturnType;
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
