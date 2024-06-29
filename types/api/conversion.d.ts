import Block from "../../src/components/block";
import { PopoverItemDefaultParams } from "../configs";

/**
 * Describes methods for converting one block to another
 */
export interface Conversion {
  /**
   * Get Block instance by html element
   *
   * @param element - html element to get Block by
   */
  getItemsForBlock(block: Block): Promise<PopoverItemDefaultParams[]>
}
