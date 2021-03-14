import BaseTool from './base';
import { ToolType } from '../modules/tools';

/**
 *
 */
export default class BlockTune extends BaseTool<any> {
  public type = ToolType.Tune;

  public instance(): any {
    return undefined;
  }
}
