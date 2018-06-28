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
    };
  }

  /**
   * Moves block down
   */
  public moveDown(): void {
    console.log('moving down', this.Editor.BlockManager);
  }

  /**
   * Moves block up
   */
  public moveUp(): void {
    console.log('moving up', this.Editor.BlockManager);
  }

  /**
   * Deletes Block
   * @param blockIndex
   */
  public delete(blockIndex?: number): void {
    this.Editor.BlockManager.removeBlock(blockIndex);
    this.Editor.Toolbar.close();

    /**
     * in case of last block deletion
     * Insert new initial empty block
     */
    if (this.Editor.BlockManager.blocks.length === 0) {
      this.Editor.BlockManager.insert();
    }

    /**
     * In case of deletion first block we need to set caret to the next block by index
     * but next jumped up after removing, so set caret to the current block means to set it to next
     */
    if (this.Editor.BlockManager.currentBlockIndex === 0) {
      this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock);
    } else {
      this.Editor.BlockManager.navigatePrevious(true);
    }
  }

}
