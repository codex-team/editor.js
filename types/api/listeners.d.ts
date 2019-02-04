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
  add(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;

  /**
   * Unsubscribe from event dispatched on passed element
   *
   * @param {Element} element
   * @param {string} eventType
   * @param {(event: Event) => void}handler
   * @param {boolean} useCapture
   */
  remove(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;
}
