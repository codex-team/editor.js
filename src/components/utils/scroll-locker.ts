
/**
 * Stores last scroll offset
 */
let scrollPosition = null;

/**
 * Name of the class applied to body element to lock scroll
 */
const scrollLockedClassName = 'ce-scroll-locked';

/**
 * Lock body element scroll
 */
export function lock(): void {
  scrollPosition = window.pageYOffset;
  document.documentElement.style.setProperty(
    '--window-scroll-offset',
    `${scrollPosition}px`
  );
  document.body.classList.add(scrollLockedClassName);
}

/**
 * Unlocks body element scroll
 */
export function unlock(): void {
  document.body.classList.remove(scrollLockedClassName);

  if (scrollPosition !== null) {
    window.scrollTo(0, scrollPosition);
  }
  scrollPosition = null;
}