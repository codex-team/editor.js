/**
 * CodeX Editor Public API
 *
 * @copyright <CodeX Team> 2018
 */
export interface IAPI {
  blocks: IBlocksAPI;
  caret: ICaretAPI;
  sanitizer: ISanitizerAPI;
  toolbar: IToolbarAPI;
}

/**
 * Working with Blocks list: moving, removing, etc
 */
export interface IBlocksAPI {

  /**
   * Move down the highlighted block
   * Using BlockManager methods
   */
  moveDown: () => void;

  /**
   * Move up the highlighted block
   * After moving the block, we need to scroll window
   */
  moveUp: () => void;

  /**
   * Removes block
   */
  delete: (blockIndex?: number) => void;
}

/**
 * Methods for working with Caret
 */
export interface ICaretAPI {}

/**
 * Sanitizer's methods
 */
export interface ISanitizerAPI {

  /**
   * Clean taint string from disallowed tags and attributes
   *
   * @param taintString
   * @param config
   */
  clean: (taintString, config) => string;
}

/**
 * Toolbar's methods
 */
export interface IToolbarAPI {}
