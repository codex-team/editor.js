import IInputOutputData from './input-output-data';

/**
 * CodeX Editor Public API
 *
 * @copyright <CodeX Team> 2018
 */
export interface IAPI {
  blocks: IBlocksAPI;
  caret: ICaretAPI;
  events: IEventsAPI;
  listener: IListenerAPI;
  sanitizer: ISanitizerAPI;
  saver: ISaverAPI;
  selection: ISelectionAPI;
  styles: IStylesAPI;
  toolbar: IToolbarAPI;
}

/**
 * Working with Blocks list: moving, removing, etc
 */
export interface IBlocksAPI {

  /**
   * Clears Blocks list
   */
  clear: () => void;

  /**
   * Fills editor with Blocks data
   */
  render: (data: IInputOutputData) => void;

  /**
   * Removes block
   */
  delete: (blockIndex?: number) => void;

  /**
   * Swap two Blocks by positions
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   */
  swap: (fromIndex: number, toIndex: number) => void;

  /**
   * Returns block by passed index
   *
   * @param {Number} index - needed block with index
   * @return {object}
   */
  getBlockByIndex: (index: number) => object;

  /**
   * Returns current block index
   * @return {number}
   */
  getCurrentBlockIndex: () => number;

  /**
   * Returns Block's count
   * @return {number}
   */
  getBlocksCount: () => number;

  /**
   * Stretch Block's content
   * @param {number} index - index of Block
   * @param {boolean} [status] - true to enable, false to disable
   */
  stretchBlock: (index: number, status: boolean) => void;
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
 * DOM Listener API
 */
export interface IListenerAPI {

  /**
   * Adds event listener
   * @param {HTMLElement} element
   * @param {string} eventType
   * @param {() => void} handler
   * @param useCapture
   * @return {boolean}
   */
  on: (element: HTMLElement, eventType: string, handler: () => void, useCapture: boolean) => void;

  /**
   * Remove event listener
   * @param {HTMLElement} element
   * @param {string} eventType
   * @param {() => void} handler
   */
  off: (element: HTMLElement, eventType: string, handler: () => void) => void;
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
  clean: (taintString, config?) => string;
}

/**
 * Saver's methods
 */
export interface ISaverAPI {
  /**
   * Return current blocks
   *
   * @return {IInputOutputData}
   */
  save: () => IInputOutputData;
}

/**
 * Selection's methods
 */
export interface ISelectionAPI {

  /**
   * Looks ahead to find passed tag from current selection
   *
   * @param {String} tagName
   * @param {String} className
   */
  findParentTag: (tagName: string, className: string) => HTMLElement|null;

  /**
   * Expands selection range to the passed parent node
   *
   * @param {HTMLElement} node
   */
  expandToTag: (node: HTMLElement) => void;
}

export interface IStylesAPI {

  block: string;

  inlineToolButton: string;

  inlineToolButtonActive: string;

  input: string;

  loader: string;

  settingsButton: string;

  settingsButtonActive: string;
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
