import { EditorState } from './editorState';
import { Action } from './action';

/**
 * Type of the function that applies the passed action to the current state and returns the new state
 */
export type Reducer = (state: EditorState, action: Action) => EditorState
