/**
 * Describes Editor`s events API
 */
export interface Events {
  /**
   * Emits event
   *
   * @param {string} eventName
   * @param {any} data
   */
  emit(eventName: string, data: any): void;

  /**
   * Unsubscribe from event
   *
   * @param {string} eventName
   * @param {(data: any) => void} callback
   */
  off(eventName: string, callback: (data?: any) => void): void;

  /**
   * Subscribe to event
   *
   * @param {string} eventName
   * @param {(data: any) => void} callback
   */
  on(eventName: string, callback: (data?: any) => void): void;
}
