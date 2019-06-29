import {ToolConstructable, ToolSettings} from '../tools';
import {OutputData} from '../index';
import {SanitizerConfig} from './sanitizer-config';

export interface EditorConfig {
  /**
   * Element where Editor will be append
   * @deprecated property will be removed in next major release, use holder instead
   */
  holderId?: string | HTMLElement;

  /**
   * Element where Editor will be append
   */
  holder?: string | HTMLElement;

  /**
   * If true, set caret at the first Block after Editor is ready
   */
  autofocus?: boolean;

  /**
   * This Tool will be used as default
   * Name should be equal to one of Tool`s keys of passed tools
   * If not specified, Paragraph Tool will be used
   */
  initialBlock?: string;

  /**
   * First Block placeholder
   */
  placeholder?: string|false;

  /**
   * Define default sanitizer configuration
   * @see {@link sanitizer}
   */
  sanitizer?: SanitizerConfig;

  /**
   * If true, toolbar won't be shown
   */
  hideToolbar?: boolean;

  /**
   * Map of Tools to use
   */
  tools?: {[toolName: string]: ToolConstructable|ToolSettings};

  /**
   * Data to render on Editor start
   */
  data?: OutputData;

  /**
   * Height of Editor's bottom area that allows to set focus on the last Block
   */
  minHeight?: number;

  /**
   * Fires when Editor is ready to work
   */
  onReady?(): void;

  /**
   * Fires when something changed in DOM
   */
  onChange?(): void;
}
