/**
 * CodeX Editor Public API
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
   *
   */
  moveDown: () => void;

  /**
   *
   */
  moveUp: () => void;
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
