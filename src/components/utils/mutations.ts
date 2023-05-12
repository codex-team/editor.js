/**
 * Check if passed mutation belongs to a passed element
 *
 * @param mutationRecord - mutation to check
 * @param element - element that is expected to contain mutation
 */
export function isMutationBelongsToElement(mutationRecord: MutationRecord, element: Element): boolean {
  const { type, target, addedNodes, removedNodes } = mutationRecord;

  /**
   * Check typing and attributes changes
   */
  if (['characterData', 'attributes'].includes(type)) {
    const targetElement = target.nodeType === Node.TEXT_NODE ? target.parentNode : target;

    return element.contains(targetElement);
  }

  /**
   * Check new/removed nodes
   */
  const addedNodesBelongsToBlock = Array.from(addedNodes).some(node => element.contains(node));
  const removedNodesBelongsToBlock = Array.from(removedNodes).some(node => element.contains(node));

  return addedNodesBelongsToBlock || removedNodesBelongsToBlock;
}
