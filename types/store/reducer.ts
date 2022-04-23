import { EditorState } from './editorState';
import { Action } from './action';

/**
 * Type of reducer function
 */
export type Reducer = (state: EditorState, action: Action) => EditorState
