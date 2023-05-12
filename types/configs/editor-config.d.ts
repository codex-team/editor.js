import {ToolConstructable, ToolSettings} from '../tools';
import {API, LogLevels, OutputData} from '../index';
import {SanitizerConfig} from './sanitizer-config';
import {I18nConfig} from './i18n-config';
import { BlockMutationEvent } from '../events/block';

export interface EditorConfig {
  /**
   * Element where Editor will be append
   * @deprecated property will be removed in the next major release, use holder instead
   */
  holderId?: string | HTMLElement;

  /**
   * Element where Editor will be appended
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
  defaultBlock?: string;

  /**
   * @deprecated
   * This property will be deprecated in the next major release.
   * Use the 'defaultBlock' property instead.
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
  tools?: {
    [toolName: string]: ToolConstructable|ToolSettings;
  }

  /**
   * Data to render on Editor start
   */
  data?: OutputData;

  /**
   * Height of Editor's bottom area that allows to set focus on the last Block
   */
  minHeight?: number;

  /**
   * Editors log level (how many logs you want to see)
   */
  logLevel?: LogLevels;

  /**
   * Enable read-only mode
   */
  readOnly?: boolean;

  /**
   * Internalization config
   */
  i18n?: I18nConfig;

  /**
   * Fires when Editor is ready to work
   */
  onReady?(): void;

  /**
   * Fires when something changed in DOM
   * @param api - editor.js api
   * @param event - custom event describing mutation. If several mutations happened at once, they will be batched and you'll get an array of events here.
   */
  onChange?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void;

  /**
   * Defines default toolbar for all tools.
   */
  inlineToolbar?: string[]|boolean;

  /**
   * Common Block Tunes list. Will be added to all the blocks which do not specify their own 'tunes' set
   */
  tunes?: string[];
}
