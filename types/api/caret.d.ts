/**
 * Describes Editor`s caret API
 */
export interface Caret {

  /**
   * Sets caret to the first Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  setToFirstBlock(position?: 'end'|'start'|'default', offset?: number): void;

  /**
   * Sets caret to the last Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  setToLastBlock(position?: 'end'|'start'|'default', offset?: number): void;

  /**
   * Sets caret to the previous Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  setToPreviousBlock(position?: 'end'|'start'|'default', offset?: number): void;

  /**
   * Sets caret to the next Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  setToNextBlock(position?: 'end'|'start'|'default', offset?: number): void;

  /**
   * Sets caret to the Block by passed index
   *
   * @param {number} index - index of Block where to set caret
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   */
  setToBlock(index: number, position?: 'end'|'start'|'default', offset?: number): void;
}
