/**
 * @class EventDispatcher
 *
 * Has two important methods:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *    - {Function off - unsubscribes callback
 *
 * @version 1.0.0
 *
 * @typedef {Events} Events
 * @property {object} subscribers - all subscribers grouped by event name
 */
export default class EventsDispatcher {
  /**
   * Object with events` names as key and array of callback functions as value
   *
   * @type {{}}
   */
  private subscribers: {[name: string]: Array<(data?: object) => object>} = {};

  /**
   * Subscribe any event on callback
   *
   * @param {string} eventName - event name
   * @param {Function} callback - subscriber
   */
  public on(eventName: string, callback: (data: object) => object): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    // group by events
    this.subscribers[eventName].push(callback);
  }

  /**
   * Subscribe any event on callback. Callback will be called once and be removed from subscribers array after call.
   *
   * @param {string} eventName - event name
   * @param {Function} callback - subscriber
   */
  public once(eventName: string, callback: (data: object) => object): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    const wrappedCallback = (data: object): object => {
      const result = callback(data);

      const indexOfHandler = this.subscribers[eventName].indexOf(wrappedCallback);

      if (indexOfHandler !== -1) {
        this.subscribers[eventName].splice(indexOfHandler, 1);
      }

      return result;
    };

    // group by events
    this.subscribers[eventName].push(wrappedCallback);
  }

  /**
   * Emit callbacks with passed data
   *
   * @param {string} eventName - event name
   * @param {object} data - subscribers get this data when they were fired
   */
  public emit(eventName: string, data?: object): void {
    if (!this.subscribers[eventName]) {
      return;
    }

    this.subscribers[eventName].reduce((previousData, currentHandler) => {
      const newData = currentHandler(previousData);

      return newData || previousData;
    }, data);
  }

  /**
   * Unsubscribe callback from event
   *
   * @param {string} eventName - event name
   * @param {Function} callback - event handler
   */
  public off(eventName: string, callback: (data: object) => object): void {
    for (let i = 0; i < this.subscribers[eventName].length; i++) {
      if (this.subscribers[eventName][i] === callback) {
        delete this.subscribers[eventName][i];
        break;
      }
    }
  }

  /**
   * Destroyer
   * clears subsribers list
   */
  public destroy(): void {
    this.subscribers = null;
  }
}
