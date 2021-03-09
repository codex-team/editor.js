import Module from '../../__module';
import { Events } from '../../../../types/api';

/**
 * @class EventsAPI
 * provides with methods working with Toolbar
 */
export default class EventsAPI extends Module {
  /**
   * Available methods
   *
   * @returns {Events}
   */
  public get methods(): Events {
    return {
      emit: (eventName: string, data: object): void => this.emit(eventName, data),
      off: (eventName: string, callback: () => void): void => this.off(eventName, callback),
      on: (eventName: string, callback: () => void): void => this.on(eventName, callback),
    };
  }

  /**
   * Subscribe on Events
   *
   * @param {string} eventName - event name to subscribe
   * @param {Function} callback - event handler
   */
  public on(eventName, callback): void {
    this.eventsDispatcher.on(eventName, callback);
  }

  /**
   * Emit event with data
   *
   * @param {string} eventName - event to emit
   * @param {object} data - event's data
   */
  public emit(eventName, data): void {
    this.eventsDispatcher.emit(eventName, data);
  }

  /**
   * Unsubscribe from Event
   *
   * @param {string} eventName - event to unsubscribe
   * @param {Function} callback - event handler
   */
  public off(eventName, callback): void {
    this.eventsDispatcher.off(eventName, callback);
  }
}
