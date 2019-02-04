import Module from '../__module';
import {EditorConfig} from '../../../types';

/**
 * Event listener information
 */
export interface ListenerData {
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
   * @param {Event} event
   */
  handler: (event: Event) => void;

  /**
   * Should event bubbling be used or not
   */
  useCapture: boolean;
}

/**
 * Codex Editor Listeners module
 *
 * @module Listeners
 *
 * Module-decorator for event listeners assignment
 *
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Listeners} Listeners
 * @property {Array} allListeners
 */
export default class Listeners extends Module {

  /**
   * Stores all listeners data to find/remove/process it
   * @type {ListenerData[]}
   */
  private allListeners: ListenerData[] = [];

  /**
   * Assigns event listener on element
   *
   * @param {EventTarget} element - DOM element that needs to be listened
   * @param {String} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {Boolean} useCapture - use event bubbling
   */
  public add(
    element: EventTarget,
    eventType: string,
    handler: (event: Event) => void,
    useCapture: boolean = false,
  ): void {
    const assignedEventData = {
      element,
      eventType,
      handler,
      useCapture,
    };

    const alreadyExist = this.findOne(element, eventType, handler);

    if (alreadyExist) { return; }

    this.allListeners.push(assignedEventData);
    element.addEventListener(eventType, handler, useCapture);
  }

  /**
   * Removes event listener from element
   *
   * @param {EventTarget} element - DOM element that we removing listener
   * @param {String} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {Boolean} useCapture - use event bubbling
   */
  public remove(
    element: EventTarget,
    eventType: string,
    handler: (event: Event) => void,
    useCapture: boolean = false,
  ): void {
    const existingListeners = this.findAll(element, eventType, handler);

    existingListeners.forEach((listener, i) => {
      const index = this.allListeners.indexOf(existingListeners[i]);

      if (index > 0) {
        this.allListeners.splice(index, 1);
      }
    });

    element.removeEventListener(eventType, handler, useCapture);
  }

  /**
   * @param {EventTarget} element
   * @param {String} eventType
   * @param {Function} handler
   * @return {EventTarget|null}
   */
  public findOne(element: EventTarget, eventType: string, handler: (event: Event) => void): ListenerData {
    const foundListeners = this.findAll(element, eventType, handler);

    return foundListeners.length > 0 ? foundListeners[0] : null;
  }

  /**
   * @param {EventTarget} element
   * @param {String} eventType
   * @param {Function} handler
   * @return {Array}
   */
  public findAll(element: EventTarget, eventType: string, handler: (event: Event) => void): ListenerData[] {
    let found;
    const foundByEventTargets = element ? this.findByEventTarget(element) : [];

    if (element && eventType && handler) {
      found = foundByEventTargets.filter( (event) => event.eventType === eventType && event.handler === handler );
    } else if (element && eventType) {
      found = foundByEventTargets.filter( (event) => event.eventType === eventType);
    } else {
      found = foundByEventTargets;
    }

    return found;
  }

  /**
   * Removes all listeners
   */
  public removeAll(): void {
    this.allListeners.map( (current) => {
      current.element.removeEventListener(current.eventType, current.handler);
    });

    this.allListeners = [];
  }

  /**
   * Search method: looks for listener by passed element
   * @param {EventTarget} element - searching element
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
   * @param {String} eventType
   * @return {Array} listeners that found on element
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
   * @param {Function} handler
   * @return {Array} listeners that found on element
   */
  private findByHandler(handler: (event: Event) => void): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.handler === handler) {
        return listener;
      }
    });
  }
}
