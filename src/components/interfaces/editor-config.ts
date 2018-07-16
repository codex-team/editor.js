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
  data: array;

  /**
   * Map for used Tools in format { name : Class, ... }
   */
  tools: object;

  /**
   * tools configuration {@link tools#ToolConfig}
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
   * Define tags not to be cutted off while pasting { p: true, b: true, a: true }
   */
  sanitizer: object;

  /**
   * Do not show toolbar
   */
  hideToolbar: boolean;
}
