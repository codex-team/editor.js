import { isEmpty } from '../utils';

/**
 * Event Dispatcher event listener
 */
type Listener<Data> = (data: Data) => void;

/**
 * Mapped type with subscriptions list
 *
 * event name -> array of callbacks
 */
type Subscriptions<EventMap> = {
  [Key in keyof EventMap]: Listener<EventMap[Key]>[];
};

/**
 * Provides methods for working with Event Bus:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *    - {Function off - unsubscribes callback
 */
export default class EventsDispatcher<EventMap> {
  /**
   * All subscribers grouped by event name
   * Object with events` names as key and array of callback functions as value
   */
  private subscribers = <Subscriptions<EventMap>>{};

  /**
   * Subscribe any event on callback
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  public on<Name extends keyof EventMap>(eventName: Name, callback: Listener<EventMap[Name]>): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    // group by events
    this.subscribers[eventName].push(callback);
  }

  /**
   * Subscribe any event on callback. Callback will be called once and be removed from subscribers array after call.
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  public once<Name extends keyof EventMap>(eventName: Name, callback: Listener<EventMap[Name]>): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    const wrappedCallback = (data: EventMap[typeof eventName]): void => {
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
   * @param eventName - event name
   * @param data - subscribers get this data when they were fired
   */
  public emit<Name extends keyof EventMap>(eventName: Name, data?: EventMap[Name]): void {
    if (isEmpty(this.subscribers) || !this.subscribers[eventName]) {
      return;
    }

    this.subscribers[eventName].reduce((previousData, currentHandler) => {
      const newData = currentHandler(previousData);

      return newData !== undefined ? newData : previousData;
    }, data);
  }

  /**
   * Unsubscribe callback from event
   *
   * @param eventName - event name
   * @param callback - event handler
   */
  public off<Name extends keyof EventMap>(eventName: Name, callback: Listener<EventMap[Name]>): void {
    if (this.subscribers[eventName] === undefined) {
      console.warn(`EventDispatcher .off(): there is no subscribers for event "${eventName.toString()}". Probably, .off() called before .on()`);

      return;
    }

    for (let i = 0; i < this.subscribers[eventName].length; i++) {
      if (this.subscribers[eventName][i] === callback) {
        delete this.subscribers[eventName][i];
        break;
      }
    }
  }

  /**
   * Destroyer
   * clears subscribers list
   */
  public destroy(): void {
    this.subscribers = {} as Subscriptions<EventMap>;
  }
}
