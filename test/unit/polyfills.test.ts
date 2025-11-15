import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const POLYFILLS_PATH = '../../src/components/polyfills';

const importPolyfills = async (): Promise<void> => {
  vi.resetModules();
  await import(POLYFILLS_PATH);
};

describe('polyfills', () => {
  describe('Element.scrollIntoViewIfNeeded', () => {
    type MutableScrollPrototype = Omit<Element, 'scrollIntoViewIfNeeded'> & {
      scrollIntoViewIfNeeded: ((centerIfNeeded?: boolean) => void) | undefined;
    };

    const prototype = Element.prototype as MutableScrollPrototype;
    let originalScrollIntoViewIfNeeded: ((centerIfNeeded?: boolean) => void) | undefined;

    beforeEach(() => {
      originalScrollIntoViewIfNeeded = prototype.scrollIntoViewIfNeeded;
      prototype.scrollIntoViewIfNeeded = undefined;
    });

    afterEach(() => {
      prototype.scrollIntoViewIfNeeded = originalScrollIntoViewIfNeeded;
    });

    it('centers the element inside the scrollable parent when out of view', async () => {
      await importPolyfills();

      const parent = document.createElement('div');
      const child = document.createElement('div');

      Object.defineProperties(parent, {
        clientHeight: {
          configurable: true,
          get: () => 100,
        },
        clientWidth: {
          configurable: true,
          get: () => 120,
        },
        offsetTop: {
          configurable: true,
          get: () => 0,
        },
        offsetLeft: {
          configurable: true,
          get: () => 0,
        },
      });

      let scrollTop = 0;
      let scrollLeft = 0;

      Object.defineProperties(parent, {
        scrollTop: {
          configurable: true,
          get: () => scrollTop,
          set: (value: number) => {
            scrollTop = value;
          },
        },
        scrollLeft: {
          configurable: true,
          get: () => scrollLeft,
          set: (value: number) => {
            scrollLeft = value;
          },
        },
      });

      Object.defineProperties(child, {
        offsetTop: {
          configurable: true,
          get: () => 150,
        },
        offsetLeft: {
          configurable: true,
          get: () => 200,
        },
        clientHeight: {
          configurable: true,
          get: () => 20,
        },
        clientWidth: {
          configurable: true,
          get: () => 30,
        },
      });

      parent.appendChild(child);
      document.body.appendChild(parent);

      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            getPropertyValue: () => '0',
          } as unknown as CSSStyleDeclaration)
      );

      child.scrollIntoViewIfNeeded();

      expect(scrollTop).toBe(110);
      expect(scrollLeft).toBe(155);

      parent.remove();
      getComputedStyleSpy.mockRestore();
    });

    it('aligns using scrollIntoView when centering not requested', async () => {
      await importPolyfills();

      const parent = document.createElement('div');
      const child = document.createElement('div');
      const scrollIntoViewMock = vi.fn((_alignToTop?: boolean) => undefined);

      Object.defineProperties(parent, {
        clientHeight: {
          configurable: true,
          get: () => 200,
        },
        offsetTop: {
          configurable: true,
          get: () => 0,
        },
      });

      let scrollTop = 120;

      Object.defineProperty(parent, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: (value: number) => {
          scrollTop = value;
        },
      });

      Object.defineProperties(child, {
        offsetTop: {
          configurable: true,
          get: () => 50,
        },
        clientHeight: {
          configurable: true,
          get: () => 40,
        },
      });

      Object.defineProperty(child, 'scrollIntoView', {
        configurable: true,
        writable: true,
        value: (alignToTop?: boolean) => {
          scrollIntoViewMock(alignToTop);
        },
      });

      parent.appendChild(child);
      document.body.appendChild(parent);

      const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            getPropertyValue: () => '0',
          } as unknown as CSSStyleDeclaration)
      );

      child.scrollIntoViewIfNeeded(false);

      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledWith(true);

      parent.remove();
      getComputedStyleSpy.mockRestore();
    });
  });

  describe('requestIdleCallback', () => {
    type GlobalWithIdle = Omit<typeof globalThis, 'requestIdleCallback' | 'cancelIdleCallback'> & {
      requestIdleCallback: (typeof window)['requestIdleCallback'] | undefined;
      cancelIdleCallback: (typeof window)['cancelIdleCallback'] | undefined;
    };

    const globalWithIdle = globalThis as GlobalWithIdle;
    let originalRequestIdleCallback: typeof window.requestIdleCallback | undefined;
    let originalCancelIdleCallback: typeof window.cancelIdleCallback | undefined;

    beforeEach(() => {
      originalRequestIdleCallback = globalWithIdle.requestIdleCallback;
      originalCancelIdleCallback = globalWithIdle.cancelIdleCallback;

      globalWithIdle.requestIdleCallback = undefined;
      globalWithIdle.cancelIdleCallback = undefined;
    });

    afterEach(() => {
      vi.useRealTimers();
      globalWithIdle.requestIdleCallback = originalRequestIdleCallback;
      globalWithIdle.cancelIdleCallback = originalCancelIdleCallback;
    });

    it('schedules callback using setTimeout when browser API missing', async () => {
      vi.useFakeTimers();

      await importPolyfills();

      const callback = vi.fn((_deadline: IdleDeadline) => undefined);
      const idleCallback: IdleRequestCallback = (deadline) => {
        callback(deadline);
      };
      const id = globalWithIdle.requestIdleCallback?.(idleCallback);

      expect(id).toBeDefined();
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);

      expect(callback).toHaveBeenCalledTimes(1);

      const recordedCalls = callback.mock.calls;
      const deadlineCall = recordedCalls[0];

      if (!deadlineCall) {
        throw new Error('Expected requestIdleCallback to invoke the provided callback');
      }

      const [ deadline ] = deadlineCall;

      expect(deadline.didTimeout).toBe(false);
      expect(deadline.timeRemaining()).toBeGreaterThanOrEqual(0);
      expect(deadline.timeRemaining()).toBeLessThanOrEqual(50);
    });

    it('cancels scheduled callback using clearTimeout', async () => {
      vi.useFakeTimers();

      await importPolyfills();

      const noopCallback: IdleRequestCallback = (_deadline: IdleDeadline) => undefined;
      const timeoutId = globalWithIdle.requestIdleCallback?.(noopCallback);
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

      if (typeof timeoutId !== 'number') {
        throw new Error('Expected cancelIdleCallback to receive a numeric handle');
      }

      globalWithIdle.cancelIdleCallback?.(timeoutId);

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);

      clearTimeoutSpy.mockRestore();
    });
  });
});

