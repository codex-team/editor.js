import { ActionType } from '../../../types/store/actionType';
import { EditorState } from '../../../types/store/editorState';
import { Action } from '../../../types/store/action';
import * as _ from '../utils';

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
