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
import Module from '../__module';

/**
 * @typedef {Listeners} Listeners
 * @property {Array} allListeners
 */
export default class Listeners extends Module {
  /**
   * @constructor
   * @param {EditorConfig} config
   */
  constructor({config}) {
    super({config});
    this.allListeners = [];
  }

  /**
   * Assigns event listener on element
   *
   * @param {Element} element - DOM element that needs to be listened
   * @param {String} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {Boolean} useCapture - use event bubbling
   */
  on(element, eventType, handler, useCapture = false) {
    let assignedEventData = {
      element,
      eventType,
      handler,
      useCapture
    };

    let alreadyExist = this.findOne(element, eventType, handler);

    if (alreadyExist) return;

    this.allListeners.push(assignedEventData);
    element.addEventListener(eventType, handler, useCapture);
  }

  /**
   * Removes event listener from element
   *
   * @param {Element} element - DOM element that we removing listener
   * @param {String} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {Boolean} useCapture - use event bubbling
   */
  off(element, eventType, handler, useCapture = false) {
    let existingListeners = this.findAll(element, eventType, handler);

    for (let i = 0; i < existingListeners.length; i++) {
      let index = this.allListeners.indexOf(existingListeners[i]);

      if (index > 0) {
        this.allListeners.splice(index, 1);
      }
    }

    element.removeEventListener(eventType, handler, useCapture);
  }

  /**
   * Search method: looks for listener by passed element
   * @param {Element} element - searching element
   * @returns {Array} listeners that found on element
   */
  findByElement(element) {
    let listenersOnElement = [];

    for (let i = 0; i < this.allListeners.length; i++) {
      let listener = this.allListeners[i];

      if (listener.element === element) {
        listenersOnElement.push(listener);
      }
    }

    return listenersOnElement;
  }

  /**
   * Search method: looks for listener by passed event type
   * @param {String} eventType
   * @return {Array} listeners that found on element
   */
  findByType(eventType) {
    let listenersWithType = [];

    for (let i = 0; i < this.allListeners.length; i++) {
      let listener = this.allListeners[i];

      if (listener.type === eventType) {
        listenersWithType.push(listener);
      }
    }

    return listenersWithType;
  }

  /**
   * Search method: looks for listener by passed handler
   * @param {Function} handler
   * @return {Array} listeners that found on element
   */
  findByHandler(handler) {
    let listenersWithHandler = [];

    for (let i = 0; i < this.allListeners.length; i++) {
      let listener = this.allListeners[i];

      if (listener.handler === handler) {
        listenersWithHandler.push(listener);
      }
    }

    return listenersWithHandler;
  }

  /**
   * @param {Element} element
   * @param {String} eventType
   * @param {Function} handler
   * @return {Element|null}
   */
  findOne(element, eventType, handler) {
    let foundListeners = this.findAll(element, eventType, handler);

    return foundListeners.length > 0 ? foundListeners[0] : null;
  }

  /**
   * @param {Element} element
   * @param {String} eventType
   * @param {Function} handler
   * @return {Array}
   */
  findAll(element, eventType, handler) {
    let found,
      foundByElements = element ? this.findByElement(element) : [];
      // foundByEventType = eventType ? this.findByType(eventType) : [],
      // foundByHandler = handler ? this.findByHandler(handler) : [];

    if (element && eventType && handler) {
      found = foundByElements.filter( event => event.eventType === eventType && event.handler === handler );
    } else if (element && eventType) {
      found = foundByElements.filter( event => event.eventType === eventType);
    } else {
      found = foundByElements;
    }

    return found;
  }

  /**
   * Removes all listeners
   */
  removeAll() {
    this.allListeners.map( (current) => {
      current.element.removeEventListener(current.eventType, current.handler);
    });

    this.allListeners = [];
  }
}
