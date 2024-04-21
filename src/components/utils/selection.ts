
/**
 * Check if passed element contains the selection
 *
 * @param el - element to check
 * @todo export if needed
 */
function isAtElement(el: HTMLElement): boolean {
  const selection = window.getSelection();

  return selection?.containsNode(el, true) || false;
}

/**
 * Check if the selection is at the start of the element
 */
export function isAtStart(el: HTMLElement): boolean {
  if (!isAtElement(el)) {
    return false;
  }

  const selection = window.getSelection();

  if (!selection) {
    return false;
  }

  const range = selection.getRangeAt(0);

  return range.startOffset === 0;
}
