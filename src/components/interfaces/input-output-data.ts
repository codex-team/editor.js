import {IBlockToolData} from './block-tool';

/**
 * Interface represents input CodeX Editor data
 * that passed with initial configuration object as 'data' key
 */
export default interface IInputOutputData {

  /**
   * Saved Blocks
   */
  readonly items: IBlockToolData[];

  /**
   * Article id. Optional
   */
  readonly id?: number|string;
}
