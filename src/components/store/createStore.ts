import { EditorState } from '../../../types/store/editorState';
import { Reducer } from '../../../types/store/reducer';
import { Action } from '../../../types/store/action';
import { Store } from '../../../types/store/store';
import * as _ from '../utils';

/**
 * This function is an entry point to use the store in the editor
 * It creates the store with an initial state
 *
 * It returns functions to use the store:
 *  subscribe - function for subscribing to each state changes
 *  dispatch - function for applying actions to the store
 *  getState - function returns a current state of the store
 *
 * @param reducer - current Editor reducer function
 * @param initialState - initial state of the store
 */
function createStore(reducer: Reducer, initialState: EditorState = { blocks: {} }): Store {
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
}

export default createStore;
