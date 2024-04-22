/**
 * Popover item abstract class
 */
export abstract class PopoverItem {
  /**
   * Returns popover item root element
   */
  public abstract getElement(): HTMLElement | null;

  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  public abstract toggleHidden(isHidden: boolean): void;
}
