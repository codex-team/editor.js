/**
 * Describes API module allowing to access some Editor UI elements and methods
 */
export interface Ui {
  /**
   * Allows accessing some Editor UI elements
   */
  nodes: UiNodes,
}

/**
 * Allows accessing some Editor UI elements
 */
export interface UiNodes {
  /**
   * Top-level editor instance wrapper
   */
  wrapper: HTMLElement,

  /**
   * Element that holds all the Blocks
   */
  redactor: HTMLElement,
}
