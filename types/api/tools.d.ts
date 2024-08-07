import { BlockToolAdapter } from '@/types/tools/adapters/block-tool-adapter';

/**
 * Describes methods for accessing installed Editor tools
 */
export interface Tools {
  /**
   * Returns all available Block Tools
   */
  getBlockTools(): BlockToolAdapter[];
}
