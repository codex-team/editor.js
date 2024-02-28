/**
 * Check if passed mutation belongs to a passed element
 *
 * @param mutationRecord - mutation to check
 * @param element - element that is expected to contain mutation
 */
export function isMutationBelongsToElement(mutationRecord: MutationRecord, element: Element): boolean {
  const { type, target, addedNodes, removedNodes } = mutationRecord;

  if (element.contains(target)) {
    return true;
  }

  /**
   * In case of removing/adding the element itself, mutation type will be 'childList' and 'removedNodes'/'addedNodes' will contain the element.
   */
  if (type === 'childList') {
    const elementAddedItself = Array.from(addedNodes).some(node => node === element);

    if (elementAddedItself) {
      return true;
    }

    const elementRemovedItself = Array.from(removedNodes).some(node => node === element);

    if (elementRemovedItself) {
      return true;
    }
  }

  return false;
}
