import {ToolConfig} from './tool-config';
import {ToolConstructable} from './tool';

/**
 * Object passed to the Tool's constructor by {@link EditorConfig#tools}
 */
export interface ToolSettings {

  /**
   * Tool's class
   */
  class: ToolConstructable;

  /**
   * User configuration object that will be passed to the Tool's constructor
   */
  config?: ToolConfig;

  /**
   * Is user available to add line brakes in Tool (for example by Shift+Enter)
   */
  enableLineBreaks?: boolean;

  /**
   * Is need to show Inline Toolbar.
   * Can accept array of Tools for InlineToolbar or boolean.
   */
  inlineToolbar?: boolean | string[];

  /**
   * Define shortcut that will render Tool
   */
  shortcut?: string;
}
