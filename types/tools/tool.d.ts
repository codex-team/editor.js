import {API} from '../index';
import {ToolConfig} from './tool-config';
import {SanitizerConfig} from '../configs';
import {MenuConfig} from './menu-config';

/**
 * Abstract interface of all Tools
 */
export interface BaseTool<RenderReturnType = HTMLElement> {
  /**
   * Tool`s render method
   *
   * For Inline Tools may return either HTMLElement (deprecated) or {@link MenuConfig}
   * @see https://editorjs.io/menu-config
   *
   * For Block Tools returns tool`s wrapper html element
   */
  render(): RenderReturnType | Promise<RenderReturnType>;
}

export interface BaseToolConstructorOptions<C extends object = any> {
  /**
   * Editor.js API
   */
  api: API;

  /**
   * Tool configuration
   */
  config?: ToolConfig<C>;
}

export interface BaseToolConstructable {
  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

  /**
   * Tool`s sanitizer configuration.
   *
   * For Block Tools, can be a Record mapping data field names to their SanitizerConfig.
   * For Inline Tools, should be a flat SanitizerConfig with tag names as keys.
   */
  sanitize?: SanitizerConfig | Record<string, SanitizerConfig>;

  /**
   * Title of Inline Tool.
   * @deprecated use {@link MenuConfig} item title instead
   */
  title?: string;

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
