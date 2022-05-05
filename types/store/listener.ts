import { EditorState } from './editorState';

/**
 * Listener function type
 * This function uses subscribing to state changes
 *
 * @param changedState - changed state after dispatch action on the state
 */
export type Listener = (changedState: EditorState) => void;
