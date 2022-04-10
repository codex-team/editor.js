import { ActionType } from './ActionType';
import { OutputData } from '../../../../types';

export type Action = {
  type: ActionType.CHANGE_EDITOR_DATA;
  data: OutputData;
}
