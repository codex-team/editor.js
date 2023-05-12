import { BlockMutationEventDetail } from './Base';

/**
 * Type name of CustomEvent related to block removed event
 */
export const BlockRemovedMutationType = 'block-removed';

/**
 * Information about removed block
 */
interface BlockRemovedEventDetail extends BlockMutationEventDetail {
  /**
   * Index of removed block
   */
  index: number;
}

/**
 * Event will be fired when some block is removed
 */
export type BlockRemovedEvent = CustomEvent<BlockRemovedEventDetail>;
