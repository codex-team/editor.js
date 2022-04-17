import { EditorState } from './types/EditorState';
import { Reducer } from './types/Reducer';
import { Action } from './types/Action';
import { Store } from './types/Store';
import * as _ from '../utils';

/**
 * Function creates store and returns functions for use it
 *
 * @param reducer - current Editor reducer function
 * @param initialState - initial state of the store
 */
const createStore = (reducer: Reducer, initialState: EditorState = {}): Store => {
  const currentReducer = reducer;
  let state = _.deepCopy(initialState);
  const currentListeners = [];

  /**
   * Function for subscribing on state changes
   *
   * @param listener - function, that will execute every state change
   *
   * @returns {() => void} unsubscribe function
   */
  const subscribe = (listener): (() => void) => {
    currentListeners.push(listener);

    return (): void => {
      currentListeners.splice(currentListeners.indexOf(listener), 1);
    };
  };

  /**
   * Dispatch action on the current state
   *
   * @param action - action that will be dispatched
   */
  const dispatch = (action: Action): void => {
    state = currentReducer(state, action);
    currentListeners.forEach((listener) => {
      listener();
    });
  };

  /**
   * Function returns current state
   */
  const getState = (): EditorState => state;

  return {
    subscribe,
    dispatch,
    getState,
  };
};

export default createStore;
