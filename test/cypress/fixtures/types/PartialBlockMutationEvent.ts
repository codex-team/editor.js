import { BlockMutationEvent, BlockMutationType } from '../../../../types';

/**
 * Simplified version of the BlockMutationEvent with optional fields that could be used in tests
 */
export default interface PartialBlockMutationEvent {
  /**
   * Event type
   */
  type?: BlockMutationType,

  /**
   * Details with partial properties
   */
  detail?: Partial<BlockMutationEvent['detail']>
}
