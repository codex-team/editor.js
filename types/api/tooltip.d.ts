/**
 * Tooltip API
 */
export interface Tooltip {
  /**
   * Show tooltip
   *
   * @param {HTMLElement} element
   * @param {HTMLElement} content
   */
  show: (element: HTMLElement, content: HTMLElement) => void;

  /**
   * Hides tooltip
   */
  hide: () => void;
}
