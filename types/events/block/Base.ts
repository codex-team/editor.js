import { BlockAPI } from '../../api';

/**
 * Details of CustomEvent fired on block mutation
 */
export interface BlockMutationEventDetail {
  /**
   * Affected block
   */
  target: BlockAPI;
}
