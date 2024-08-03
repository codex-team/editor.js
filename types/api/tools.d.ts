import { BlockToolWrapper } from '@/types/tools/wrappers/block-tool-wrapper';

/**
 * Describes methods for accessing installed Editor tools
 */
export interface Tools {
  /**
   * Returns all available Block Tools
   */
  getBlockTools(): BlockToolWrapper[];
}
