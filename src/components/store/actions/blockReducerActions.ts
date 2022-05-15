import { OutputBlockData } from '../../../../types';
import { BlockMutationType } from '../../../../types/events/block/mutation-type';
import { ChangeBlockDataAction, CreateBlockAction, RemoveBlockAction } from '../../../../types/store/action';

/**
 * Action creator for creating a new block in the store
 *
 * @param block - new block data
 */
export function makeCreateBlockAction(block: OutputBlockData): CreateBlockAction {
  return {
    type: BlockMutationType.Added,
    data: block,
  };
}

/**
 * Action creator for changing block data in the store
 *
 * @param block - new block data
 */
export function makeChangeBlockAction(block: OutputBlockData): ChangeBlockDataAction {
  return {
    type: BlockMutationType.Changed,
    data: block,
  };
}

/**
 * Action creator for removing block data from the store
 *
 * @param blockId - id of a block for removing
 */
export function makeRemoveBlockAction(blockId: string): RemoveBlockAction {
  return {
    type: BlockMutationType.Removed,
    blockId,
  };
}
