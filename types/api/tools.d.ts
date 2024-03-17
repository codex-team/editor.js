import { ToolConfig } from '../tools';

/**
 * Describes Tools API methods
 */
export interface Tools {
  /**
   * Updates tool's config
   *
   * @param toolName name of the tool
   * @param config config of the tool
   */
  updateToolConfig(toolName: string, config: ToolConfig): void
}
