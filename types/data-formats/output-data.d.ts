import {BlockToolData} from '../tools';
import {BlockTuneData} from '../block-tunes/block-tune-data';
import { BlockId } from './block-id';

/**
 * Output of one Tool
 *
 * @template Type - the string literal describing a tool type
 * @template Data - the structure describing a data object supported by the tool
 */
export interface OutputBlockData<Type extends string = string, Data extends object = any> {
  /**
   * Unique Id of the block
   */
  id?: BlockId;
  /**
   * Tool type
   */
  type: Type;
  /**
   * Saved Block data
   */
  data: BlockToolData<Data>;

  /**
   * Block Tunes data
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
