import BlockTool from "../../src/components/tools/block";

/**
 * Describes methods for accessing installed Editor tools
 */
export interface Tools {
  /**
   * Returns all available Block Tools
   */
  getBlockTools(): BlockTool[];
}
