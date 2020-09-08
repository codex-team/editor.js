/**
 * Describes methods for work with Selections
 */
export interface Selection {
  /**
   * Looks ahead from selection and find passed tag with class name
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   * @return {HTMLElement|null}
   */
  findParentTag(tagName: string, className?: string): HTMLElement|null;

  /**
   * Expand selection to passed tag
   * @param {HTMLElement} node - tag that should contain selection
   */
  expandToTag(node: HTMLElement): void;
  /**
   * clear saved range
   */
  clearSaved(): void;

  /**
   * collapse current selection
   */
  collapseToEnd(): void;

  /**
   * Save selected range
   */
  save(): void;

  /**
   * Restore saved selected range
   */
  restore(): void;

  /**
   * Set fake background to the selected text content 
   * inorder to change the focus to something else
   */
  setFakeBackground(): void;

  /**
   * Remove fake background which was set earlier
   */
  removeFakeBackground(): void;

  /**
   * Check if fake background is enabled or not
   */
  isFakeBackgroundEnabled: boolean;
}
