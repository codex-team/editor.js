import Module from '../../__module';
import {Caret} from '../../../../types/api';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module {
  /**
   * Available methods
   * @return {Caret}
   */
  get methods(): Caret {
    return {
      setToFirstBlock: this.setToFirstBlock,
      setToLastBlock: this.setToLastBlock,
      setToPreviousBlock: this.setToPreviousBlock,
      setToNextBlock: this.setToNextBlock,
      setToBlock: this.setToBlock,
    };
  }

  /**
   * Sets caret to the first Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  private setToFirstBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): void => {
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.firstBlock, position, offset);
  }

  /**
   * Sets caret to the last Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  private setToLastBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): void => {
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.lastBlock, position, offset);
  }

  /**
   * Sets caret to the previous Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  private setToPreviousBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): void => {
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.previousBlock, position, offset);
  }

  /**
   * Sets caret to the next Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  private setToNextBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): void => {
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.nextBlock, position, offset);
  }

  /**
   * Sets caret to the Block by passed index
   *
   * @param {number} index - index of Block where to set caret
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  private setToBlock = (
    index: number,
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset: number = 0,
  ): void  => {
    this.Editor.Caret.setToBlock(this.Editor.BlockManager.blocks[index], position, offset);
  }
}
