/**
 * Base structure for the Inline Toolbar Tool
 */
export default interface IInlineTool {

  /**
   * Class name for Tool's icon
   */
  iconClassName?: string;

  /**
   * Ability to open Toolbox and change Tool if all Block's field are empty
   */
  irreplaceable?: boolean;

  /**
   * Define Tool type as Inline
   */
  isInline?: boolean;

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
