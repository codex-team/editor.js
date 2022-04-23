import { ActionType } from '../../../types/store/actionType';
import { EditorState } from '../../../types/store/editorState';
import { Action } from '../../../types/store/action';
import * as _ from '../utils';

/**
 * Reducer function for Editor.js state
 * This function applies actions in the current state
 *
 * @param state - previous state to apply action
 * @param action - information about the action in the previous state
 */
const reducer = (state: EditorState, action: Action): EditorState => {
  const stateCopy = _.deepCopy(state);

  switch (action.type) {
    case ActionType.CREATE_BLOCK:
    case ActionType.CHANGE_BLOCK_DATA:
      stateCopy.blocks[action.data.id] = action.data;
      break;

    case ActionType.REMOVE_BLOCK:
      delete stateCopy.blocks[action.blockId];
      break;
  }

  return stateCopy;
};

export default reducer;
