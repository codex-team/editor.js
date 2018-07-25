import IInputOutputData from '../../input-output-data';

/**
 * Working with Blocks list: moving, removing, etc
 */
export default interface IBlocksAPI {

  /**
   * Clears Blocks list
   */
  clear: () => void;

  /**
   * Fills editor with Blocks data
   */
  render: (data: IInputOutputData) => void;

  /**
   * Removes block
   */
  delete: (blockIndex?: number) => void;

  /**
   * Swap two Blocks by positions
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   */
  swap: (fromIndex: number, toIndex: number) => void;

  /**
   * Returns block by passed index
   *
   * @param {Number} index - needed block with index
   * @return {object}
   */
  getBlockByIndex: (index: number) => object;

  /**
   * Returns current block index
   * @return {number}
   */
  getCurrentBlockIndex: () => number;

  /**
   * Returns Block's count
   * @return {number}
   */
  getBlocksCount: () => number;

  /**
   * Stretch Block's content
   * @param {number} index - index of Block
   * @param {boolean} [status] - true to enable, false to disable
   */
  stretchBlock: (index: number, status: boolean) => void;
}
