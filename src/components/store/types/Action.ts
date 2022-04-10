import { ActionType } from './ActionType';
import { OutputBlockData } from '../../../../types';

type CreateBlockAction = {
  type: ActionType.CREATE_BLOCK;
  data: OutputBlockData;
}

type ChangeBlockDataAction = {
  type: ActionType.CHANGE_BLOCK_DATA;
  data: OutputBlockData;
}

type RemoveBlockAction = {
  type: ActionType.REMOVE_BLOCK;
  blockId: string;
};

export type Action = CreateBlockAction | ChangeBlockDataAction | RemoveBlockAction;
