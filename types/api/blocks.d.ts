import Block from '../../src/components/block';
import {OutputBlockData, OutputData} from '../data-formats/output-data';
import {BlockToolData, ToolConfig} from '../tools';
import {BlockAPI} from './block';
import {BlockTuneData} from '../block-tunes/block-tune-data';

/**
 * Describes methods to manipulate with Editor`s blocks
 */
export interface Blocks {
  /**
   * Remove all blocks from Editor zone
   */
  clear(): Promise<void>;

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
  getBlockByIndex(index: number): BlockAPI | undefined;

  /**
   * Returns Block API object by passed Block id
   * @param id - id of the block
   */
  getById(id: string): BlockAPI | null;

  /**
   * Returns current Block index
   * @returns {number}
   */
  getCurrentBlockIndex(): number;

  /**
   * Returns the index of Block by id;
   */
  getBlockIndex(blockId: string): number;

  /**
   * Get Block API object by html element
   *
   * @param element - html element to get Block by
   */
  getBlockByElement(element: HTMLElement): BlockAPI | undefined;

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
   * Insert new Block and return inserted Block API
   *
   * @param {string} type — Tool name
   * @param {BlockToolData} data — Tool data to insert
   * @param {ToolConfig} config — Tool config
   * @param {number?} index — index where to insert new Block
   * @param {boolean?} needToFocus - flag to focus inserted Block
   * @param {boolean?} replace - should the existed Block on that index be replaced or not
   * @param {string} id — An optional id for the new block. If omitted then the new id will be generated
   */
  insert(
    type?: string,
    data?: BlockToolData,
    config?: ToolConfig,
    index?: number,
    needToFocus?: boolean,
    replace?: boolean,
    id?: string,
  ): BlockAPI;

  /**
   * Inserts several Blocks to specified index
   */
  insertMany(
    blocks: OutputBlockData[],
    index?: number,
  ): BlockAPI[];


  /**
   * Creates data of an empty block with a passed type.
   *
   * @param toolName - block tool name
   */
  composeBlockData(toolName: string): Promise<BlockToolData>

  /**
   * Updates block data by id
   *
   * @param id - id of the block to update
   * @param data - (optional) the new data. Can be partial.
   * @param tunes - (optional) tune data
   */
  update(id: string, data?: Partial<BlockToolData>, tunes?: {[name: string]: BlockTuneData}): Promise<BlockAPI>;

  /**
   * Converts block to another type. Both blocks should provide the conversionConfig.
   *
   * @param id - id of the existed block to convert. Should provide 'conversionConfig.export' method
   * @param newType - new block type. Should provide 'conversionConfig.import' method
   * @param dataOverrides - optional data overrides for the new block
   *
   * @throws Error if conversion is not possible
   */
  convert(id: string, newType: string, dataOverrides?: BlockToolData): Promise<BlockAPI>;
}
