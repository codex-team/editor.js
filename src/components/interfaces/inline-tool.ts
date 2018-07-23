/**
 * Base structure for the Inline Toolbar Tool
 */
export default interface InlineTool {
  /**
   * Allow Tool to determine shortcut that will fire 'surround' method
   */
  shortcut?: string;

  /**
   * Returns button for the Inline Toolbar
   */
  render(): HTMLElement;

  /**
   * Make additional element with actions
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   */
  renderActions?(): HTMLElement;

  /**
   * Method that accepts selected range and wrap it somehow
   * @param {Range} range - selection's range
   */
  surround(range: Range): void;

  /**
   * Get Selection and detect if Tool was applied
   * For example, after that Tool can highlight button or show some details
   * @param {Selection} selection - current Selection
   */
  checkState(selection: Selection): boolean;

  /**
   * Function called with Inline Toolbar closing
   */
  clear?(): void;
}
