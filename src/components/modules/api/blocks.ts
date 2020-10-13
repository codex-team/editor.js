import { BlockAPI as BlockAPIInterface, Blocks } from '../../../../types/api';
import { BlockToolData, OutputData, ToolConfig } from '../../../../types';
import * as _ from './../../utils';
import BlockAPI from '../../block/api';
import Module from '../../__module';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Blocks}
   */
  public get methods(): Blocks {
    return {
      clear: (): void => this.clear(),
      render: (data: OutputData): Promise<void> => this.render(data),
      renderFromHTML: (data: string): Promise<void> => this.renderFromHTML(data),
      delete: (index?: number): void => this.delete(index),
      swap: (fromIndex: number, toIndex: number): void => this.swap(fromIndex, toIndex),
      move: (toIndex: number, fromIndex?: number): void => this.move(toIndex, fromIndex),
      getBlockByIndex: (index: number): BlockAPIInterface | void => this.getBlockByIndex(index),
      getCurrentBlockIndex: (): number => this.getCurrentBlockIndex(),
      getBlocksCount: (): number => this.getBlocksCount(),
      stretchBlock: (index: number, status = true): void => this.stretchBlock(index, status),
      insertNewBlock: (): void => this.insertNewBlock(),
      insert: this.insert,
    };
  }

  /**
   * Returns Blocks count
   *
   * @returns {number}
   */
  public getBlocksCount(): number {
    return this.Editor.BlockManager.blocks.length;
  }

  /**
   * Returns current block index
   *
   * @returns {number}
   */
  public getCurrentBlockIndex(): number {
    return this.Editor.BlockManager.currentBlockIndex;
  }

  /**
   * Returns BlockAPI object by Block index
   *
   * @param {number} index - index to get
   */
  public getBlockByIndex(index: number): BlockAPIInterface | void {
    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (block === undefined) {
      _.logLabeled('There is no block at index `' + index + '`', 'warn');

      return;
    }

    return new BlockAPI(block);
  }

  /**
   * Call Block Manager method that swap Blocks
   *
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   * @deprecated — use 'move' instead
   */
  public swap(fromIndex: number, toIndex: number): void {
    _.log(
      '`blocks.swap()` method is deprecated and will be removed in the next major release. ' +
      'Use `block.move()` method instead',
      'info'
    );

    this.Editor.BlockManager.swap(fromIndex, toIndex);

    /**
     * Move toolbar
     * DO not close the settings
     */
    this.Editor.Toolbar.move(false);
  }

  /**
   * Move block from one index to another
   *
   * @param {number} toIndex - index to move to
   * @param {number} fromIndex - index to move from
   */
  public move(toIndex: number, fromIndex?: number): void {
    this.Editor.BlockManager.move(toIndex, fromIndex);

    /**
     * Move toolbar
     * DO not close the settings
     */
    this.Editor.Toolbar.move(false);
  }

  /**
   * Deletes Block
   *
   * @param {number} blockIndex - index of Block to delete
   */
  public delete(blockIndex?: number): void {
    try {
      this.Editor.BlockManager.removeBlock(blockIndex);
    } catch (e) {
      _.logLabeled(e, 'warn');

      return;
    }

    /**
     * in case of last block deletion
     * Insert the new default empty block
     */
    if (this.Editor.BlockManager.blocks.length === 0) {
      this.Editor.BlockManager.insert();
    }

    /**
     * After Block deletion currentBlock is updated
     */
    if (this.Editor.BlockManager.currentBlock) {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END);
    }

    this.Editor.Toolbar.close();
  }

  /**
   * Clear Editor's area
   */
  public clear(): void {
    this.Editor.BlockManager.clear(true);
    this.Editor.InlineToolbar.close();
  }

  /**
   * Fills Editor with Blocks data
   *
   * @param {OutputData} data — Saved Editor data
   */
  public render(data: OutputData): Promise<void> {
    this.Editor.BlockManager.clear();

    return this.Editor.Renderer.render(data.blocks);
  }

  /**
   * Render passed HTML string
   *
   * @param {string} data - HTML string to render
   * @returns {Promise<void>}
   */
  public renderFromHTML(data: string): Promise<void> {
    this.Editor.BlockManager.clear();

    return this.Editor.Paste.processText(data, true);
  }

  /**
   * Stretch Block's content
   *
   * @param {number} index - index of Block to stretch
   * @param {boolean} status - true to enable, false to disable
   *
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  public stretchBlock(index: number, status = true): void {
    _.deprecationAssert(
      true,
      'blocks.stretchBlock()',
      'BlockAPI'
    );

    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (!block) {
      return;
    }

    block.stretched = status;
  }

  /**
   * Insert new Block
   *
   * @param {string} type — Tool name
   * @param {BlockToolData} data — Tool data to insert
   * @param {ToolConfig} config — Tool config
   * @param {number?} index — index where to insert new Block
   * @param {boolean?} needToFocus - flag to focus inserted Block
   */
  public insert = (
    type: string = this.config.defaultBlock,
    data: BlockToolData = {},
    config: ToolConfig = {},
    index?: number,
    needToFocus?: boolean
  ): void => {
    this.Editor.BlockManager.insert({
      tool: type,
      data,
      index,
      needToFocus,
    });
  }

  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo remove in 3.0.0
   *
   * @deprecated with insert() method
   */
  public insertNewBlock(): void {
    _.log('Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. ' +
      'Use blocks.insert() instead.', 'warn');
    this.insert();
  }
}
