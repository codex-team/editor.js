/**
 * Describes Editor`s listeners API
 */
export interface Listeners {
  /**
   * Subscribe to event dispatched on passed element. Returns listener id.
   *
   * @param {Element} element
   * @param {string} eventType
   * @param {(event: Event) => void}handler
   * @param {boolean} useCapture
   */
  on(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): string;

  /**
   * Unsubscribe from event dispatched on passed element
   *
   * @param {Element} element
   * @param {string} eventType
   * @param {(event: Event) => void}handler
   * @param {boolean} useCapture
   */
  off(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;


  /**
   * Unsubscribe from event dispatched by the listener id
   *
   * @param id - id of the listener to remove
   */
  offById(id: string): void;
}
