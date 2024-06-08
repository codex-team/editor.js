import Module from '../../__module';
import { Tools } from '../../../../types/api';

/**
 * API module allowing to access some Tools module getters or methods
 */
export default class ToolsAPI extends Module {
  /**
   * Available methods / getters
   */
  public get methods(): Tools {
    return {
      blockTools: this.Editor.Tools.blockTools,
    };
  }
}
