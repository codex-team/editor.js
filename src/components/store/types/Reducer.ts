import { EditorState } from './EditorState';
import { Action } from './Action';

export type Reducer = (state: EditorState, action: Action) => EditorState
