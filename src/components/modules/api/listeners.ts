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
      add: (element: HTMLElement, eventType, handler, useCapture) => this.add(element, eventType, handler, useCapture),
      remove: (element, eventType, handler) => this.remove(element, eventType, handler),
    } as Listeners;
  }

  /**
   * adds DOM event listener
   *
   * @param {HTMLElement} element
   * @param {string} eventType
   * @param {() => void} handler
   * @param {boolean} useCapture
   */
  public add(element: HTMLElement, eventType: string, handler: () => void, useCapture?: boolean): void {
    this.Editor.Listeners.add(element, eventType, handler, useCapture);
  }

  /**
   * Removes DOM listener from element
   *
   * @param element
   * @param eventType
   * @param handler
   */
  public remove(element, eventType, handler): void {
    this.Editor.Listeners.remove(element, eventType, handler);
  }
}
