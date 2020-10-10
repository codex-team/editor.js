import {BlockToolData} from '../tools';

/**
 * Output of one Tool
 */
export interface OutputBlockData<S extends string = string, T extends object = any> {
  /**
   * Tool type
   */
  type: S;
  /**
   * Saved Block data
   */
  data: BlockToolData<T>;
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
