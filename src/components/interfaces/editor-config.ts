import IBlockTool from './block-tool';
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
   * todo define input block's type
   */
  data: object[];

  /**
   * Map of used Tools
   */
  tools: {string: IBlockTool};

  /**
   * tools configuration {@link tools#ToolConfig}
   * todo create interface
   */
  toolsConfig: object;

  /**
   * This Tool will be added by default
   */
  initialBlock: string;

  /**
   * First Block placeholder
   */
  placeholder: string;

  /**
   * Define tags not to be stripped off while pasting
   */
  sanitizer: ISanitizerConfig;

  /**
   * Do not show toolbar
   */
  hideToolbar: boolean;
}
