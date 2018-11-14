import {Tool, ToolSettings} from '../tools';
import {OutputData} from '../data-formats/output-data';
import {SanitizerConfig} from './sanitizer-config';

export interface EditorConfig {
  /**
   * Element where Editor will be append
   */
  holderId: string;

  /**
   * This Tool will be used as default
   * Name should be equal to one of Tool`s keys of passed tools
   * If not specified, Paragraph Tool will be used
   */
  initialBlock?: string;

  /**
   * First Block placeholder
   */
  placeholder?: string;

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
  tools?: {[toolName: string]: Tool|ToolSettings};

  /**
   * Data to render on Editor start
   */
  data?: OutputData;

  /**
   * Fires when Editor is ready to work
   */
  onReady?(): void;

  /**
   * Fires when something changed in DOM
   */
  onChange?(): void;
}
