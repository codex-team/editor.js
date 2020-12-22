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
   * Toggles Block Setting of Current Focused Elements
   * @param {boolean} openingState —  opening state of Block Setting
   */
  toggleBlockSettings(openingState?: boolean): void;
}
