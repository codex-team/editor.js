import { ActionType } from './ActionType';
import { OutputBlockData } from '../index';

interface CreateBlockAction {
  type: ActionType.CREATE_BLOCK;
  data: OutputBlockData;
}

interface ChangeBlockDataAction {
  type: ActionType.CHANGE_BLOCK_DATA;
  data: OutputBlockData;
}

interface RemoveBlockAction {
  type: ActionType.REMOVE_BLOCK;
  blockId: string;
}

/**
 * Available action types
 */
export type Action = CreateBlockAction | ChangeBlockDataAction | RemoveBlockAction;
