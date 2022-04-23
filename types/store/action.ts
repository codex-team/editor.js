import { OutputBlockData } from '../index';
import { BlockMutationType } from '../events/block/mutation-type';

/**
 * Action for creating a new block in the editor
 * This action will add the new block to the state
 */
interface CreateBlockAction {
  type: BlockMutationType.Added;
  data: OutputBlockData;
}

/**
 * Action for changing data of an existing block
 * This action will change block data in the state by its id
 */
interface ChangeBlockDataAction {
  type: BlockMutationType.Changed;
  data: OutputBlockData;
}

/**
 * Action for removing a block from the editor
 * This action will remove the block from the state by its id
 */
interface RemoveBlockAction {
  type: BlockMutationType.Removed;
  blockId: string;
}

/**
 * Available action types
 */
export type Action = CreateBlockAction | ChangeBlockDataAction | RemoveBlockAction;
