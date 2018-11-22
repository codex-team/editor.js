import Module from '../../__module';
import {Listeners} from '../../../../types/api';

/**
 * @class ListenersAPI
 * Provides with methods working with DOM Listener
 */
export default class ListenersAPI extends Module {
  /**
   * Available methods
   * @return {Listeners}
   */
  get methods(): Listeners {
    return {
      on: (element: HTMLElement, eventType, handler, useCapture) => this.on(element, eventType, handler, useCapture),
      off: (element, eventType, handler) => this.off(element, eventType, handler),
    };
  }

  /**
   * adds DOM event listener
   *
   * @param {HTMLElement} element
   * @param {string} eventType
   * @param {() => void} handler
   * @param {boolean} useCapture
   */
  public on(element: HTMLElement, eventType: string, handler: () => void, useCapture?: boolean): void {
    this.Editor.Listeners.on(element, eventType, handler, useCapture);
  }

  /**
   * Removes DOM listener from element
   *
   * @param element
   * @param eventType
   * @param handler
   */
  public off(element, eventType, handler): void {
    this.Editor.Listeners.off(element, eventType, handler);
  }
}
