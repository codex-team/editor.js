import {BlockToolData} from '../tools';
import {BlockTuneData} from '../block-tunes';

/**
 * Output of one Tool
 */
export interface OutputBlockData {
  /**
   * Too type
   */
  type: string;
  /**
   * Saved Block data
   */
  data: BlockToolData;

  /**
   * Saved Block Tunes data
   */
  tunes?: {[name: string]: BlockTuneData};
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
