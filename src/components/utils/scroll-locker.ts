import { isIosDevice } from '../utils';

/**
 * Utility allowing to lock body scroll on demand
 */
export default class ScrollLocker {
  /**
   * Style classes
   */
  private static CSS = {
    scrollLocked: 'ce-scroll-locked',
    scrollLockedHard: 'ce-scroll-locked--hard',
  };

  /**
   * Stores scroll position, used for hard scroll lock
   */
  private scrollPosition: null | number = null;

  /**
   * Locks body element scroll
   */
  public lock(): void {
    if (isIosDevice) {
      this.lockHard();
    } else {
      document.body.classList.add(ScrollLocker.CSS.scrollLocked);
    }
  }

  /**
   * Unlocks body element scroll
   */
  public unlock(): void {
    if (isIosDevice) {
      this.unlockHard();
    } else {
      document.body.classList.remove(ScrollLocker.CSS.scrollLocked);
    }
  }

  /**
   * Locks scroll in a hard way (via setting fixed position to body element)
   */
  private lockHard(): void {
    this.scrollPosition = window.pageYOffset;
    document.documentElement.style.setProperty(
      '--window-scroll-offset',
      `${this.scrollPosition}px`
    );
    document.body.classList.add(ScrollLocker.CSS.scrollLockedHard);
  }

  /**
   * Unlocks hard scroll lock
   */
  private unlockHard(): void {
    document.body.classList.remove(ScrollLocker.CSS.scrollLockedHard);
    if (this.scrollPosition !== null) {
      window.scrollTo(0, this.scrollPosition);
    }
    this.scrollPosition = null;
  }
}
