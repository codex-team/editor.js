/**
 * Wraps current selection with span imitating selection.
 * Return a method for restoring selection based on this span
 */
export function createFakeSelection(): () => void {
  console.info('createFakeSelection');

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const span = document.createElement('span');

  span.classList.add('ce-fake-selection');

  range?.surroundContents(span);


  return function restore(onlyUnwrap = false) {
    if (!span.parentNode) {
      return;
    }

    /**
     * Unwrap the span, restoring the original content
     */
    const parent = span.parentNode;

    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);

    if (onlyUnwrap) {
      return;
    }

    /**
     * Restore the selection range
     */
    // requestAnimationFrame(() => {
    const newRange = document.createRange();

    newRange.setStart(range.startContainer, range.startOffset);
    newRange.setEnd(range.endContainer, range.endOffset);

    // Set the selection to the new range
    selection.removeAllRanges();
    selection.addRange(newRange);
    // });
  };
}
