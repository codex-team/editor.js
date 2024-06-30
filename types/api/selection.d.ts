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
   * Sets fake background
  */
  setFakeBackground(): void;

  /**
   * Save SelectionUtils's range
   */
  save(): void;

  /**
   * Restore saved SelectionUtils's range
   */
  restore(): void;

  /**
   * Removes fake background
   */
  removeFakeBackground(): void;
}
