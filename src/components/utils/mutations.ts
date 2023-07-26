/**
 * Check if passed mutation belongs to a passed element
 *
 * @param mutationRecord - mutation to check
 * @param element - element that is expected to contain mutation
 */
export function isMutationBelongsToElement(mutationRecord: MutationRecord, element: Element): boolean {
  const { type, target, addedNodes, removedNodes } = mutationRecord;

  /**
   * In case of removing the whole text in element, mutation type will be 'childList',
   * 'removedNodes' will contain text node that is not existed anymore, so we can't check it with 'contains' method
   * But Target will be the element itself, so we can detect it.
   */
  if (target === element) {
    return true;
  }

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
