import Module from '../../__module';

import * as API from '../../../../types/api';
import {OutputData} from '../../../../types';
import Block from '../../block';
import {ModuleConfig} from '../../types/module-config';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: ModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {API.blocks}
   */
  get methods(): API.blocks {
    return {
      clear: () => this.clear(),
      render: (data: OutputData) => this.render(data),
      delete: () => this.delete(),
      swap: (fromIndex: number, toIndex: number) => this.swap(fromIndex, toIndex),
      getBlockByIndex: (index: number) => this.getBlockByIndex(index),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlocksCount: () => this.getBlocksCount(),
      stretchBlock: (index: number, status: boolean = true) => this.stretchBlock(index, status),
      insertNewBlock: () => this.insertNewBlock(),
    } as API.blocks;
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
   * Returns Current Block
   * @param {Number} index
   *
   * @return {Object}
   */
  public getBlockByIndex(index: number): Block {
    return this.Editor.BlockManager.getBlockByIndex(index);
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
     * In case of deletion first block we need to set caret to the current Block
     */
    if (this.Editor.BlockManager.currentBlockIndex === 0) {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
    } else {
      this.Editor.Caret.navigatePrevious(true);
    }

    this.Editor.Toolbar.close();
  }

  /**
   * Clear Editor's area
   */
  public clear(): void {
    this.Editor.BlockManager.clear(true);
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
   * After set caret to this Block
   */
  public insertNewBlock() {
    const newBlock = this.Editor.BlockManager.insert();
    this.Editor.Caret.setToBlock(newBlock);
  }
}
