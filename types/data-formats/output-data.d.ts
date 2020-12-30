import {BlockToolData} from '../tools';

/**
 * Output of one Tool
 */
export interface OutputBlockData {
  /**
   * Unique Id of the block
   */
  id?: string;
  /**
   * Too type
   */
  type: string;
  /**
   * Saved Block data
   */
  data: BlockToolData;
}

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
  blocks: OutputBlockData[];
}
