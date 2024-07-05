import { BlockAPI } from "./block";

/**
 * Describes Editor`s caret API
 */
export interface Caret {

  /**
   * Sets caret to the first Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  setToFirstBlock(position?: 'end'|'start'|'default', offset?: number): boolean;

  /**
   * Sets caret to the last Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  setToLastBlock(position?: 'end'|'start'|'default', offset?: number): boolean;

  /**
   * Sets caret to the previous Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  setToPreviousBlock(position?: 'end'|'start'|'default', offset?: number): boolean;

  /**
   * Sets caret to the next Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  setToNextBlock(position?: 'end'|'start'|'default', offset?: number): boolean;

  /**
   * Sets caret to the Block by passed index
   *
   * @param blockOrIdOrIndex - BlockAPI or Block id or Block index
   * @param position - position where to set caret
   * @param offset - caret offset
   *
   * @return {boolean}
   */
  setToBlock(blockOrIdOrIndex: BlockAPI | BlockAPI['id'] | number, position?: 'end'|'start'|'default', offset?: number): boolean;

  /**
   * Sets caret to the Editor
   *
   * @param {boolean} atEnd - if true, set Caret to the end of the Editor
   *
   * @return {boolean}
   */
  focus(atEnd?: boolean): boolean;
}
