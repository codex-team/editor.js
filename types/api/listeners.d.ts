/**
 * Describes Editor`s listeners API
 */
export interface Listeners {
  /**
   * Subscribe to event dispatched on passed element
   *
   * @param {Element} element
   * @param {string} eventType
   * @param {(event: Event) => void}handler
   * @param {boolean} useCapture
   */
  on(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;

  /**
   * Unsubscribe from event dispatched on passed element
   *
   * @param {Element} element
   * @param {string} eventType
   * @param {(event: Event) => void}handler
   * @param {boolean} useCapture
   */
  off(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;
}
