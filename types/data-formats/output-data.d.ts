import {BlockToolData} from '../tools';

export interface OutputData {
  /**
   * Editor's version
   */
  version?: string;

  /**
   * Timestamp of saving in milliseconds
   */
  time?: number;

  /**
   * Saved Blocks
   */
  blocks: Array<{
    type: string;
    data: BlockToolData
  }>;
}
