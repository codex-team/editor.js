import { EditorState } from './EditorState';
import { Action } from './Action';

/**
 * Type of reducer function
 */
export type Reducer = (state: EditorState, action: Action) => EditorState
