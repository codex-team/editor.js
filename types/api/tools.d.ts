import BlockTool from "../../src/components/tools/block";
import ToolsCollection from "../../src/components/tools/collection";

/**
 * Describes API module allowing to access some Tools module getters and methods
 */
export interface Tools {
  /**
   * Allows accessing some Editor UI elements
   */
  blockTools: ToolsCollection<BlockTool>,
}
