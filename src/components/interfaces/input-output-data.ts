import IBlockToolData from './tools/block-tool-data';

/**
 * Interface represents input CodeX Editor data
 * that passed with initial configuration object as 'data' key
 */
export default interface IInputOutputData {

  /**
   * Timestamp of saving in milliseconds
   */
  readonly time?: number;

  /**
   * Saved Blocks
   */
  readonly items: IBlockToolData[];

  /**
   * Editor's version
   */
  readonly version?: string;
}
