
/**
 * Stores last scroll offset
 */
let scrollPosition = null;

/**
 * Name of the class applied to html element to lock body scroll
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
  document.documentElement.classList.add(scrollLockedClassName);
}

/**
 * Unlocks body element scroll
 */
export function unlock(): void {
  document.documentElement.classList.remove(scrollLockedClassName);

  if (scrollPosition !== null) {
    window.scrollTo(0, scrollPosition);
  }
  scrollPosition = null;
}