import { ToolConfig } from '../../../../types';
import { Tools } from '../../../../types/api';
import * as _ from '../../utils';
import Module from '../../__module';

/**
 * @class ToolsAPI
 * Provides methods for working with the Tools
 */
export default class ToolsAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Tools}
   */
  public get methods(): Tools {
    return {
      updateToolConfig: (toolName: string, config: ToolConfig) => this.updateToolConfig(toolName, config),
    };
  }

  /**
   * Update Tool's config
   *
   * @param toolName Name of the tool
   * @param config Tools Config
   */
  public updateToolConfig(toolName: string, config: ToolConfig): void {
    const tool = this.Editor.Tools.available.get(toolName);

    if (tool) {
      tool.updateConfig(config);
    } else {
      _.log(`Incorrect toolName: ${toolName}`);
    }
  }
}