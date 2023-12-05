import type { BlockMutationEventDetail } from './Base';

/**
 * Type name of CustomEvent related to block changed event
 */
export const BlockChangedMutationType = 'block-changed';

/**
 * Information about changed block
 */
interface BlockChangedEventDetail extends BlockMutationEventDetail {
  /**
   * Index of changed block
   */
  index: number;
}

/**
 * Event will be fired when some block is changed
 */
export type BlockChangedEvent = CustomEvent<BlockChangedEventDetail>;
