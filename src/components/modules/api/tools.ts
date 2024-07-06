import { Tools as ToolsAPIInterface } from '../../../../types/api';
import Module from '../../__module';

/**
 * Provides methods for accessing installed Editor tools
 */
export default class ToolsAPI extends Module {
  /**
   * Available methods
   */
  public get methods(): ToolsAPIInterface {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values()),
    };
  }
}
