import type { BlockMutationCustomEvent } from '../../../src/components/events/BlockMutation';
import { BlockMutationEventDetail } from './Base';

/**
 * Type name of CustomEvent related to block added event
 */
export const BlockAddedMutationType = 'block-added';

/**
 * Information about added block
 */
export interface BlockAddedEventDetail extends BlockMutationEventDetail {
  /**
   * Index of added block
   */
  index: number;
}

/**
 * Event will be fired when the new block is added to the editor
 */
export type BlockAddedEvent = BlockMutationCustomEvent<typeof BlockAddedMutationType, BlockAddedEventDetail>;
