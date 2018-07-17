import IBlockTool from './block-tool';
import IBlockToolConfig from './block-tool';
import ISanitizerConfig from './sanitizer-config';

/**
 * Editor Instance config
 */
export default interface IEditorConfig {

  /**
   * Element to append Editor
   */
  holderId: string;

  /**
   * Blocks list in JSON-format
   */
  data: IBlockToolConfig[];

  /**
   * Map of used Tools
   */
  tools: {[toolName: string]: IBlockTool};

  /**
   * Tools configuration
   * @see {@link tools#ToolConfig}
   */
  toolsConfig: {[toolName: string]: IBlockToolConfig};

  /**
   * This Tool will be added by default
   * Name should be equal a one Tool's key of Editor's Tools
   */
  initialBlock: string;

  /**
   * First Block placeholder
   */
  placeholder: string;

  /**
   * Define tags not to be stripped off while pasting
   * @see {@link sanitizer}
   */
  sanitizer: ISanitizerConfig;

  /**
   * Do not show toolbar
   */
  hideToolbar: boolean;
}
