import {OutputData} from '../data-formats/output-data';
import {BlockToolData, ToolConfig} from '../tools';
import {BlockAPI} from './block';

/**
 * Describes methods to manipulate with Editor`s blocks
 */
export interface Blocks {
  /**
   * Remove all blocks from Editor zone
   */
  clear(): void;

  /**
   * Render passed data
   *
   * @param {OutputData} data - saved Block data
   *
   * @returns {Promise<void>}
   */
  render(data: OutputData): Promise<void>;

  /**
   * Render passed HTML string
   * @param {string} data
   * @return {Promise<void>}
   */
  renderFromHTML(data: string): Promise<void>;

  /**
   * Removes current Block
   * @param {number} index - index of a block to delete
   */
  delete(index?: number): void;

  /**
   * Swaps two Blocks
   * @param {number} fromIndex - block to swap
   * @param {number} toIndex - block to swap with
   * @deprecated — use 'move' instead
   */
  swap(fromIndex: number, toIndex: number): void;

  /**
   * Moves a block to a new index
   * @param {number} toIndex - index where the block is moved to
   * @param {number} fromIndex - block to move
   */
  move(toIndex: number, fromIndex?: number): void;

  /**
   * Returns Block API object by passed Block index
   * @param {number} index
   */
  getBlockByIndex(index: number): BlockAPI | void;

  /**
   * Returns current Block index
   * @returns {number}
   */
  getCurrentBlockIndex(): number;

  /**
   * Mark Block as stretched
   * @param {number} index - Block to mark
   * @param {boolean} status - stretch status
   *
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  stretchBlock(index: number, status?: boolean): void;

  /**
   * Returns Blocks count
   * @return {number}
   */
  getBlocksCount(): number;

  /**
   * Insert new Initial Block after current Block
   *
   * @deprecated
   */
  insertNewBlock(): void;

  /**
   * Insert new Block
   *
   * @param {string} type — Tool name
   * @param {BlockToolData} data — Tool data to insert
   * @param {ToolConfig} config — Tool config
   * @param {number?} index — index where to insert new Block
   * @param {boolean?} needToFocus - flag to focus inserted Block
   */
  insert(
    type?: string,
    data?: BlockToolData,
    config?: ToolConfig,
    index?: number,
    needToFocus?: boolean,
  ): void;

}
