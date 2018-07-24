/**
 * Object passed to the Tool's constructor by {@link IEditorConfig#toolsConfig}
 */
import IBlockTool from './block-tool';
import IInlineTool from './inline-tool';

export default interface IToolSettings {

  /**
   * Tool's class
   */
  class: IBlockTool|IInlineTool;

  /**
   * Tool's configuration
   */
  config?: object;

  /**
   * Disable module {@link Paste} for this Tool
   */
  disallowPaste?: boolean;

  /**
   * Is user available to add line brakes in Tool (for example by Shift+Enter)
   */
  enableLineBreaks?: boolean;

  /**
   * Show inline Toolbar in this Tool
   */
  inlineToolbar?: boolean;

  /**
   * Define shortcut for this Tool
   */
  shortcut?: string;
}
