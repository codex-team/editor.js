/**
 * What kind of modification happened with the Block
 */
export enum BlockMutationType {
  /**
   * New Block added
   */
  Added = 'block-added',

  /**
   * On Block deletion
   */
  Removed = 'block-removed',

  /**
   * Moving of a Block
   */
  Moved = 'block-moved',

  /**
   * Any changes inside the Block
   */
  Changed = 'block-changed',
}
