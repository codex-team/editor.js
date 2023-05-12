import { BlockMutationEventDetail } from './Base';

/**
 * Type name of CustomEvent related to block moved event
 */
export const BlockMovedMutationType = 'block-moved';

/**
 * Information about moved block
 */
interface BlockMovedEventDetail extends BlockMutationEventDetail {
  /**
   * Previous block position
   */
  fromIndex: number;

  /**
   * New block position
   */
  toIndex: number;
}

/**
 * Event will be fired when some block is moved to another position
 */
export type BlockMovedEvent = CustomEvent<BlockMovedEventDetail>;
