import type Block from '../block';

/**
 * Check if two blocks could be merged.
 *
 * We can merge two blocks if:
 *  - they have the same type
 *  - they have a merge function (.mergeable = true)
 *
 * @param targetBlock - block to merge to
 * @param blockToMerge - block to merge from
 */
export function areBlocksMergeable(targetBlock: Block, blockToMerge: Block): boolean {
  return targetBlock.mergeable && targetBlock.name === blockToMerge.name;
}
