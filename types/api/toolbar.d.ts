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
   * Toggles Toolbar of Current Focused Elements
   * @param {boolean} openingState —  opening state of Toolbar
   */
  toggleToolBar(openingState?: boolean): void;
}
