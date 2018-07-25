/**
 * Base structure for the Inline Toolbar Tool
 */
import ITool from './tool';

export default interface IInlineTool extends ITool {

  /**
   * Returns button for the Inline Toolbar
   */
  render(): HTMLElement;

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
   * Make additional element with actions
   * For example, input for the 'link' tool or textarea for the 'comment' tool
   */
  renderActions?(): HTMLElement;

  /**
   * Function called with Inline Toolbar closing
   */
  clear?(): void;
}
