'use strict';

declare global {
  interface Element {
    /**
     * Scrolls the current element into the visible area of the browser window
     *
     * @param centerIfNeeded - true, if the element should be aligned so it is centered within the visible area of the scrollable ancestor.
     */
    scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
  }
}

/**
 * ScrollIntoViewIfNeeded polyfill by KilianSSL (forked from hsablonniere)
 *
 * @see {@link https://gist.github.com/KilianSSL/774297b76378566588f02538631c3137}
 * @param centerIfNeeded - true, if the element should be aligned so it is centered within the visible area of the scrollable ancestor.
 */
if (typeof Element.prototype.scrollIntoViewIfNeeded === 'undefined') {
  Element.prototype.scrollIntoViewIfNeeded = function (this: HTMLElement, centerIfNeeded): void {
    const shouldCenter = centerIfNeeded ?? true;

    const parent = this.parentElement;

    if (!parent) {
      return;
    }

    const parentComputedStyle = window.getComputedStyle(parent, null);
    const parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'));
    const parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width'));
    const overTop = this.offsetTop - parent.offsetTop < parent.scrollTop;
    const overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight);
    const overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft;
    const overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth);
    const alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && shouldCenter) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
    }

    if ((overLeft || overRight) && shouldCenter) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !shouldCenter) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

/**
 * RequestIdleCallback polyfill (shims)
 *
 * @see https://developer.chrome.com/blog/using-requestidlecallback/
 * @param cb - callback to be executed when the browser is idle
 */
type TimeoutHandle = ReturnType<typeof globalThis.setTimeout>;
const nativeSetTimeout = globalThis.setTimeout.bind(globalThis);
const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);

const idleCallbackTimeouts = new Map<number, TimeoutHandle>();

const resolveNumericHandle = (handle: TimeoutHandle): number => {
  const numericHandle = Number(handle);

  if (Number.isFinite(numericHandle) && numericHandle > 0) {
    return numericHandle;
  }

  return Date.now();
};

if (typeof window.requestIdleCallback === 'undefined') {
  window.requestIdleCallback = function (cb) {
    const start = Date.now();
    const handleRef: { value?: number } = {};
    const timeoutHandle = nativeSetTimeout(() => {
      const handle = handleRef.value;

      if (typeof handle === 'number') {
        idleCallbackTimeouts.delete(handle);
      }

      cb({
        didTimeout: false,
        timeRemaining: function () {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
    const numericHandle = resolveNumericHandle(timeoutHandle);

    handleRef.value = numericHandle;
    idleCallbackTimeouts.set(numericHandle, timeoutHandle);

    return numericHandle;
  };
}

if (typeof window.cancelIdleCallback === 'undefined') {
  window.cancelIdleCallback = function (id) {
    const timeoutHandle = idleCallbackTimeouts.get(id);

    if (timeoutHandle !== undefined) {
      idleCallbackTimeouts.delete(id);
      nativeClearTimeout(timeoutHandle);
    }

    globalThis.clearTimeout(id);
  };
}

export {};
