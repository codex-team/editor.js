import { Action } from './action';
import { EditorState } from './editorState';
import { Listener } from './listener';

/**
 * Store type contains functions for use it
 */
export interface Store {
  /**
   * Function for subscribing on state changes
   *
   * @param listener - function, that will execute every state change
   *
   * @returns {() => void} unsubscribe function
   */
  subscribe: (listener: Listener) => (() => void);

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
