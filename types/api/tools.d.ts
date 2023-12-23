import { ToolConfig } from '../tools';

/**
 * Describes Tools API methods
 */
export interface Tools {
    /**
     * Updates tool's config
     *
     * @param toolName Name of the tool
     * @param type inline or block tools
     */
   updateToolConfig(toolName:string, config: ToolConfig): void
}
