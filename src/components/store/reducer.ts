import { ActionType } from './types/ActionType';
import { EditorState } from './types/EditorState';
import { Action } from './types/Action';

const reducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case ActionType.CHANGE_EDITOR_DATA:
      return {
        ...state,
        data: action.data,
      };
  }
};

export default reducer;
