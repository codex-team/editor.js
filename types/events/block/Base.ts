import type { BlockAPI } from '../../api';
import { BlockTuneData } from '../../block-tunes/block-tune-data';

/**
 * Details of CustomEvent fired on block mutation
 */
export interface BlockMutationEventDetail {
  /**
   * Affected block
   */
  target: BlockAPI;

  tunes?: { [name: string]: BlockTuneData };
}
