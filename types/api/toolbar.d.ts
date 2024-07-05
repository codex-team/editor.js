/**
 * Describes Toolbar API methods
 */
export interface Toolbar {
  /**
   * Closes Toolbar
   */
  close(): void;

  /**
   * Opens Toolbar
   */
  open(): void;

  /**
   * Toggles Block Setting of the current block
   * @param {boolean} openingState —  opening state of Block Setting
   */
  toggleBlockSettings(openingState?: boolean): void;

  /**
   * Toggle toolbox
   * @param {boolean} openingState —  opening state of the toolbox
   */
  toggleToolbox(openingState?: boolean): void;
}
