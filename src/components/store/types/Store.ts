import { Action } from './Action';
import { EditorState } from './EditorState';

/**
 * Store type contains functions for use it
 */
export type Store = {
  /**
   * Function for subscribing on state changes
   *
   * @param listener - function, that will execute every state change
   *
   * @returns {() => void} unsubscribe function
   */
  subscribe: (listener: () => void) => (() => void);

  /**
   * Dispatch action on the current state
   *
   * @param action - action that will be dispatched
   */
  dispatch: (action: Action) => void;

  /**
   * Function returns current state
   */
  getState: () => EditorState;
}
