declare var Module: any;

import { IBlocksAPI } from '../interfaces/api';
import IInputOutputData from '../interfaces/input-output-data';
import IModuleConfig from '../interfaces/module-config';

/**
 * @class BlocksAPI
 * provides with methods working with Block
 */
export default class BlocksAPI extends Module implements IBlocksAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {IBlocksAPI}
   */
  get methods(): IBlocksAPI {
    return {
      clear: () => this.clear(),
      render: (data: IInputOutputData) => this.render(data),
      delete: () => this.delete(),
      swap: (fromIndex: number, toIndex: number) => this.swap(fromIndex, toIndex),
      getBlockByIndex: (index: number) => this.getBlockByIndex(index),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlocksCount: () => this.getBlocksCount(),
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
   * Returns Current Block
   * @param {Number} index
   *
   * @return {Object}
   */
  public getBlockByIndex(index: number): object {
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
   * @param {IInputOutputData} data — Saved Editor data
   */
  public render(data: IInputOutputData): void {
    this.Editor.BlockManager.clear();
    this.Editor.Renderer.render(data.items);
  }

}
