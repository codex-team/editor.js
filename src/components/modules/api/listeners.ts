import { Listeners } from '../../../../types/api';
import Module from '../../__module';

/**
 * @class ListenersAPI
 * Provides with methods working with DOM Listener
 */
export default class ListenersAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Listeners}
   */
  public get methods(): Listeners {
    return {
      on: (element: HTMLElement, eventType, handler, useCapture): void => this.on(element, eventType, handler, useCapture),
      off: (element, eventType, handler, useCapture): void => this.off(element, eventType, handler, useCapture),
    };
  }

  /**
   * adds DOM event listener
   *
   * @param {HTMLElement} element - Element to set handler to
   * @param {string} eventType - event type
   * @param {() => void} handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  public on(element: HTMLElement, eventType: string, handler: () => void, useCapture?: boolean): void {
    this.listeners.on(element, eventType, handler, useCapture);
  }

  /**
   * Removes DOM listener from element
   *
   * @param {Element} element - Element to remove handler from
   * @param eventType - event type
   * @param handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  public off(element: Element, eventType: string, handler: () => void, useCapture?: boolean): void {
    this.listeners.off(element, eventType, handler, useCapture);
  }
}
