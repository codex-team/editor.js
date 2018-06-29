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
      moveDown: () => this.moveDown(),
      moveUp: () => this.moveUp(),
      getCurrentBlock: () => this.getCurrentBlock(),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
    };
  }

  /**
   * Moves block down
   */
  public moveDown(): void {
    console.log('moving down', this.Editor.BlockManager);
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
   */
  public getCurrentBlock(): object {
    return this.Editor.BlockManager.currentBlock;
  }

  /**
   * Moves block up
   */
  public moveUp(): void {
    this.Editor.BlockManager.moveCurrentBlockUp();
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
