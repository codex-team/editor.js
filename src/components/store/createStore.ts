import { EditorState } from '../../../types/store/EditorState';
import { Reducer } from '../../../types/store/Reducer';
import { Action } from '../../../types/store/Action';
import { Store } from '../../../types/store/Store';

/**
 * Function creates store and returns functions for use it
 *
 * @param reducer - current Editor reducer function
 * @param initialState - initial state of the store
 */
function createStore(reducer: Reducer, initialState: EditorState = {}): Store {
  const currentReducer = reducer;
  let state = initialState;
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
}

export default createStore;
