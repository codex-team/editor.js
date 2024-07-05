/**
 * Check if passed mutation belongs to a passed element
 *
 * @param mutationRecord - mutation to check
 * @param element - element that is expected to contain mutation
 */
export function isMutationBelongsToElement(mutationRecord: MutationRecord, element: Element): boolean {
  const { type, target, addedNodes, removedNodes } = mutationRecord;

  /**
   * Skip own technical mutations, for example, data-empty attribute changes
   */
  if (mutationRecord.type === 'attributes' && mutationRecord.attributeName === 'data-empty') {
    return false;
  }

  /**
   * Covers all types of mutations happened to the element or it's descendants with the only one exception - removing/adding the element itself;
   */
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
