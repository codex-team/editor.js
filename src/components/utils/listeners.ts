import * as _ from '../utils';

/**
 * Event listener information
 *
 * @interface ListenerData
 */
export interface ListenerData {
  /**
   * Listener unique identifier
   */
  id: string;

  /**
   * Element where to listen to dispatched events
   */
  element: EventTarget;

  /**
   * Event to listen
   */
  eventType: string;

  /**
   * Event handler
   *
   * @param {Event} event - event object
   */
  handler: (event: Event) => void;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  options: boolean | AddEventListenerOptions;
}

/**
 * Editor.js Listeners helper
 *
 * Decorator for event listeners assignment
 *
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Listeners} Listeners
 * @property {ListenerData[]} allListeners - listeners store
 */
export default class Listeners {
  /**
   * Stores all listeners data to find/remove/process it
   *
   * @type {ListenerData[]}
   */
  private allListeners: ListenerData[] = [];

  /**
   * Assigns event listener on element and returns unique identifier
   *
   * @param {EventTarget} element - DOM element that needs to be listened
   * @param {string} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   *
   * @returns {string}
   */
  public on(
    element: EventTarget,
    eventType: string,
    handler: (event: Event) => void,
    options: boolean | AddEventListenerOptions = false
  ): string {
    const id = _.generateId('l');
    const assignedEventData = {
      id,
      element,
      eventType,
      handler,
      options,
    };

    const alreadyExist = this.findOne(element, eventType, handler);

    if (alreadyExist) {
      return;
    }

    this.allListeners.push(assignedEventData);
    element.addEventListener(eventType, handler, options);

    return id;
  }

  /**
   * Removes event listener from element
   *
   * @param {EventTarget} element - DOM element that we removing listener
   * @param {string} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  public off(
    element: EventTarget,
    eventType: string,
    handler?: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    const existingListeners = this.findAll(element, eventType, handler);

    existingListeners.forEach((listener, i) => {
      const index = this.allListeners.indexOf(existingListeners[i]);

      if (index > -1) {
        this.allListeners.splice(index, 1);

        listener.element.removeEventListener(listener.eventType, listener.handler, listener.options);
      }
    });
  }

  /**
   * Removes listener by id
   *
   * @param {string} id - listener identifier
   */
  public offById(id: string): void {
    const listener = this.findById(id);

    if (!listener) {
      return;
    }

    listener.element.removeEventListener(listener.eventType, listener.handler, listener.options);
  }

  /**
   * Finds and returns first listener by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} [eventType] - event type
   * @param {Function} [handler] - event handler
   *
   * @returns {ListenerData|null}
   */
  public findOne(element: EventTarget, eventType?: string, handler?: (event: Event) => void): ListenerData {
    const foundListeners = this.findAll(element, eventType, handler);

    return foundListeners.length > 0 ? foundListeners[0] : null;
  }

  /**
   * Return all stored listeners by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} eventType - event type
   * @param {Function} handler - event handler
   *
   * @returns {ListenerData[]}
   */
  public findAll(element: EventTarget, eventType?: string, handler?: (event: Event) => void): ListenerData[] {
    let found;
    const foundByEventTargets = element ? this.findByEventTarget(element) : [];

    if (element && eventType && handler) {
      found = foundByEventTargets.filter((event) => event.eventType === eventType && event.handler === handler);
    } else if (element && eventType) {
      found = foundByEventTargets.filter((event) => event.eventType === eventType);
    } else {
      found = foundByEventTargets;
    }

    return found;
  }

  /**
   * Removes all listeners
   */
  public removeAll(): void {
    this.allListeners.map((current) => {
      current.element.removeEventListener(current.eventType, current.handler, current.options);
    });

    this.allListeners = [];
  }

  /**
   * Module cleanup on destruction
   */
  public destroy(): void {
    this.removeAll();
  }

  /**
   * Search method: looks for listener by passed element
   *
   * @param {EventTarget} element - searching element
   *
   * @returns {Array} listeners that found on element
   */
  private findByEventTarget(element: EventTarget): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.element === element) {
        return listener;
      }
    });
  }

  /**
   * Search method: looks for listener by passed event type
   *
   * @param {string} eventType - event type
   *
   * @returns {ListenerData[]} listeners that found on element
   */
  private findByType(eventType: string): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.eventType === eventType) {
        return listener;
      }
    });
  }

  /**
   * Search method: looks for listener by passed handler
   *
   * @param {Function} handler - event handler
   *
   * @returns {ListenerData[]} listeners that found on element
   */
  private findByHandler(handler: (event: Event) => void): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.handler === handler) {
        return listener;
      }
    });
  }

  /**
   * Returns listener data found by id
   *
   * @param {string} id - listener identifier
   *
   * @returns {ListenerData}
   */
  private findById(id: string): ListenerData {
    return this.allListeners.find((listener) => listener.id === id);
  }
}
