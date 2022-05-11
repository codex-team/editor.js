import { OutputBlockData } from '../../../../types';
import { BlockMutationType } from '../../../../types/events/block/mutation-type';
import { ChangeBlockDataAction, CreateBlockAction, RemoveBlockAction } from '../../../../types/store/action';

/**
 * Action creator for creating a new block in the store
 *
 * @param block - new block data
 */
export const createBlock = (block: OutputBlockData): CreateBlockAction => ({
  type: BlockMutationType.Added,
  data: block,
});

/**
 * Action creator for changing block data in the store
 *
 * @param block - new block data
 */
export const changeBlock = (block: OutputBlockData): ChangeBlockDataAction => ({
  type: BlockMutationType.Changed,
  data: block,
});

/**
 * Action creator for removing block data from the store
 *
 * @param blockId - id of a block for removing
 */
export const removeBlock = (blockId: string): RemoveBlockAction => ({
  type: BlockMutationType.Removed,
  blockId,
});
