import { BlockAddedEvent, BlockAddedEventDetail, BlockAddedMutationType } from './BlockAdded';
import { BlockChangedEvent, BlockChangedEventDetail, BlockChangedMutationType } from './BlockChanged';
import { BlockMovedEvent, BlockMovedEventDetail, BlockMovedMutationType } from './BlockMoved';
import { BlockRemovedEvent, BlockRemovedEventDetail, BlockRemovedMutationType } from './BlockRemoved';

/**
 * What kind of modification happened with the Block
 */
// export enum BlockMutationType {
//   /**
//    * New Block added
//    */
//   Added = BlockAddedMutationType,

//   /**
//    * On Block deletion
//    */
//   Removed = BlockRemovedMutationType,

//   /**
//    * Moving of a Block
//    */
//   Moved = BlockMovedMutationType,

//   /**
//    * Any changes inside the Block
//    */
//   Changed = BlockChangedMutationType,
// }

export type BlockMutationType = typeof BlockAddedMutationType | typeof BlockRemovedMutationType | typeof BlockMovedMutationType | typeof BlockChangedMutationType;

/**
 * CustomEvent describing a change related to a block
 */
export type BlockMutationEvent = BlockAddedEvent | BlockChangedEvent | BlockMovedEvent | BlockRemovedEvent;

/**
 * Union type of all available block mutation event details
 */
// export type BlockMutationEventDetail = BlockAddedEventDetail | BlockChangedEventDetail | BlockMovedEventDetail | BlockRemovedEventDetail;
