/**
 * DOM Listener API
 */
export default interface IListenerAPI {

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
