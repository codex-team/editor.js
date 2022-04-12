import { ActionType } from './types/ActionType';
import { EditorState } from './types/EditorState';
import { Action } from './types/Action';
import * as _ from '../utils';

const reducer = (state: EditorState, action: Action): EditorState => {
  const stateCopy = _.deepCopy(state);

  switch (action.type) {
    case ActionType.CREATE_BLOCK:
    case ActionType.CHANGE_BLOCK_DATA:
      stateCopy[action.data.id] = action.data;
      break;

    case ActionType.REMOVE_BLOCK:
      delete stateCopy[action.blockId];
      break;
  }

  return stateCopy;
};

export default reducer;
