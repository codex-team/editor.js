import {OutputData} from '../data-formats/output-data';

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
   * @param {OutputData} data
   * @return {Promise<void>}
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
   */
  delete(): void;

  /**
   * Swaps two Blocks
   * @param {number} fromIndex - block to swap
   * @param {number} toIndex - block to swap with
   */
  swap(fromIndex: number, toIndex: number): void;

  /**
   * Returns Block holder by Block index
   * @param {number} index
   * @returns {HTMLElement}
   */
  getBlockByIndex(index: number): HTMLElement;

  /**
   * Returns current Block index
   * @returns {number}
   */
  getCurrentBlockIndex(): number;

  /**
   * Mark Block as stretched
   * @param {number} index - Block to mark
   * @param {boolean} status - stretch status
   */
  stretchBlock(index: number, status?: boolean): void;

  /**
   * Returns Blocks count
   * @return {number}
   */
  getBlocksCount(): number;

  /**
   * Insert new Initial Block after current Block
   */
  insertNewBlock(): void;
}
