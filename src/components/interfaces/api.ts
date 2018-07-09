/**
 * CodeX Editor Public API
 *
 * @copyright <CodeX Team> 2018
 */
export interface IAPI {
  blocks: IBlocksAPI;
  caret: ICaretAPI;
  events: IEventsAPI;
  sanitizer: ISanitizerAPI;
  selection: ISelectionAPI;
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
 * Events Module API methods
 */
export interface IEventsAPI {

  /**
   * Subsribe on events
   */
  on: (eventName: string, callback: () => void) => void;

  /**
   * Trigger subsribed callbacks
   */
  emit: (eventName: string, data: object) => void;

  /**
   * Unsubsribe callback
   */
  off: (eventName: string, callback: () => void) => void;
}

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
 * Selection's methods
 */
export interface ISelectionAPI {

  /**
   * Looks ahead to find passed tag from current selection
   *
   * @param tagName
   * @param className
   */
  findParentTag: (tagName: string, className: string) => Node;
}

/**
 * Toolbar's methods
 * Basic toolbar methods
 */
export interface IToolbarAPI {

  /**
   * Opens only toolbar
   */
  open: () => void;

  /**
   * Closes toolbar. If toolbox or toolbar-blockSettings are opened then they will be closed too
   */
  close: () => void;
}
