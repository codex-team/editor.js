/**
 * Object passed to the Tool's constructor by {@link IEditorConfig#tools}
 */
import ITool from './tool';

export default interface IToolSettings {

  /**
   * Tool's class
   */
  class: ITool;

  /**
   * User configuration object that will be passed to the Tool's constructor
   */
  config?: object;

  /**
   * Disable module {@link Paste} for this Tool
   * @todo remove this option
   */
  disallowPaste?: boolean;

  /**
   * Is user available to add line brakes in Tool (for example by Shift+Enter)
   */
  enableLineBreaks?: boolean;

  /**
   * Is need to show Inline Toolbar.
   * Can accept array of Tools for InlineToolbar or boolean.
   */
  inlineToolbar?: boolean|string[];

  /**
   * Define shortcut that will render Tool
   */
  shortcut?: string;
}
