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
      on: (element: HTMLElement, eventType, handler, useCapture): string => this.on(element, eventType, handler, useCapture),
      off: (element, eventType, handler, useCapture): void => this.off(element, eventType, handler, useCapture),
      offById: (id): void => this.offById(id),
    };
  }

  /**
   * Ads a DOM event listener. Return it's id.
   *
   * @param {HTMLElement} element - Element to set handler to
   * @param {string} eventType - event type
   * @param {() => void} handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  public on(element: HTMLElement, eventType: string, handler: () => void, useCapture?: boolean): string {
    return this.listeners.on(element, eventType, handler, useCapture);
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

  /**
   * Removes DOM listener by the listener id
   *
   * @param id - id of the listener to remove
   */
  public offById(id: string): void {
    this.listeners.offById(id);
  }
}
