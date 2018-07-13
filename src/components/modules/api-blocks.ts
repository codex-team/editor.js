declare var Module: any;

import { IBlocksAPI } from '../interfaces/api';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module implements IBlocksAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {IBlocksAPI}
   */
  get methods(): IBlocksAPI {
    return {
      delete: () => this.delete(),
      swapBlocksPosition: (fromIndex: number, toIndex: number) => this.swapBlocksPosition(fromIndex, toIndex),
      getBlockByIndex: (index: number) => this.getBlockByIndex(index),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
    };
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
  public getBlockByIndex(index: number): object {
    return this.Editor.BlockManager.getBlockByIndex(index);
  }

  /**
   * Call Block Manager method that swap blocks in state
   * @param {number} fromIndex
   * @param {number} toIndex
   */
  public swapBlocksPosition(fromIndex: number, toIndex: number): void {
    this.Editor.BlockManager.swapBlocksPosition(fromIndex, toIndex);
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
      if (this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock)) {
        this.Editor.Toolbar.close();
      }
    } else {
      if (this.Editor.Caret.navigatePrevious(true)) {
        this.Editor.Toolbar.close();
      }
    }
  }

}
