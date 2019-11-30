import Module from '../../__module';

import {Blocks} from '../../../../types/api';
import {BlockToolData, OutputData, ToolConfig} from '../../../../types';
import * as _ from './../../utils';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module {
  /**
   * Available methods
   * @return {Blocks}
   */
  get methods(): Blocks {
    return {
      clear: () => this.clear(),
      render: (data: OutputData) => this.render(data),
      renderFromHTML: (data: string) => this.renderFromHTML(data),
      delete: () => this.delete(),
      swap: (fromIndex: number, toIndex: number) => this.swap(fromIndex, toIndex),
      getBlockByIndex: (index: number) => this.getBlockByIndex(index),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlocksCount: () => this.getBlocksCount(),
      stretchBlock: (index: number, status: boolean = true) => this.stretchBlock(index, status),
      insertNewBlock: () => this.insertNewBlock(),
      insert: this.insert,
    };
  }

  /**
   * Returns Blocks count
   * @return {number}
   */
  public getBlocksCount(): number {
    return this.Editor.BlockManager.blocks.length;
  }

  /**
   * Returns current block index
   * @return {number}
   */
  public getCurrentBlockIndex(): number {
    return this.Editor.BlockManager.currentBlockIndex;
  }

  /**
   * Returns Block holder by Block index
   * @param {Number} index
   *
   * @return {HTMLElement}
   */
  public getBlockByIndex(index: number): HTMLElement {
    const block = this.Editor.BlockManager.getBlockByIndex(index);
    return block.holder;
  }

  /**
   * Call Block Manager method that swap Blocks
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   */
  public swap(fromIndex: number, toIndex: number): void {
    this.Editor.BlockManager.swap(fromIndex, toIndex);

    /**
     * Move toolbar
     * DO not close the settings
     */
    this.Editor.Toolbar.move(false);
  }

  /**
   * Deletes Block
   * @param blockIndex
   */
  public delete(blockIndex?: number): void {
    this.Editor.BlockManager.removeBlock(blockIndex);

    /**
     * in case of last block deletion
     * Insert new initial empty block
     */
    if (this.Editor.BlockManager.blocks.length === 0) {
      this.Editor.BlockManager.insert();
    }

    /**
     * After Block deletion currentBlock is updated
     */
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END);

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
   * @param {OutputData} data — Saved Editor data
   */
  public render(data: OutputData): Promise<void> {
    this.Editor.BlockManager.clear();
    return this.Editor.Renderer.render(data.blocks);
  }

  /**
   * Render passed HTML string
   * @param {string} data
   * @return {Promise<void>}
   */
  public renderFromHTML(data: string): Promise<void> {
    this.Editor.BlockManager.clear();
    return this.Editor.Paste.processText(data, true);
  }

  /**
   * Stretch Block's content
   * @param {number} index
   * @param {boolean} status - true to enable, false to disable
   */
  public stretchBlock(index: number, status: boolean = true): void {
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
    type: string = this.config.initialBlock,
    data: BlockToolData = {},
    config: ToolConfig = {},
    index?: number,
    needToFocus?: boolean,
  ): void => {
    this.Editor.BlockManager.insert(
      type,
      data,
      config,
      index,
      needToFocus,
    );
  }

  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo: remove in 3.0.0
   *
   * @deprecated with insert() method
   */
  public insertNewBlock(): void {
    _.log('Method blocks.insertNewBlock() is deprecated and it will be removed in next major release. ' +
      'Use blocks.insert() instead.', 'warn');
    this.insert();
  }
}
