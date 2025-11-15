import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollLocker from '../../../../src/components/utils/scroll-locker';

const { getIsIosDeviceValue, setIsIosDeviceValue } = vi.hoisted(() => {
  let value = false;

  return {
    getIsIosDeviceValue: () => value,
    setIsIosDeviceValue: (nextValue: boolean) => {
      value = nextValue;
    },
  };
});

vi.mock('../../../../src/components/utils', async () => {
  const actual = await vi.importActual('../../../../src/components/utils');

  return {
    ...actual,
    get isIosDevice() {
      return getIsIosDeviceValue();
    },
  };
});

const originalScrollTo = window.scrollTo;

describe('ScrollLocker', () => {
  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = '';
    document.documentElement?.style.removeProperty('--window-scroll-offset');
    setIsIosDeviceValue(false);
    delete (window as { pageYOffset?: number }).pageYOffset;
  });

  afterEach(() => {
    if (originalScrollTo) {
      window.scrollTo = originalScrollTo;
    } else {
      delete (window as { scrollTo?: typeof window.scrollTo }).scrollTo;
    }
    document.body.className = '';
    document.documentElement?.style.removeProperty('--window-scroll-offset');
    setIsIosDeviceValue(false);
    delete (window as { pageYOffset?: number }).pageYOffset;
  });

  it('adds and removes body class on non-iOS devices', () => {
    setIsIosDeviceValue(false);
    const locker = new ScrollLocker();

    locker.lock();

    expect(document.body.classList.contains('ce-scroll-locked')).toBe(true);

    locker.unlock();

    expect(document.body.classList.contains('ce-scroll-locked')).toBe(false);
  });

  it('performs hard lock on iOS devices and restores scroll position', () => {
    const storedScroll = 160;

    setIsIosDeviceValue(true);
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: storedScroll,
    });

    const scrollTo = vi.fn();

    window.scrollTo = scrollTo;

    const locker = new ScrollLocker();

    locker.lock();

    expect(document.body.classList.contains('ce-scroll-locked--hard')).toBe(true);
    expect(document.documentElement?.style.getPropertyValue('--window-scroll-offset')).toBe(`${storedScroll}px`);

    locker.unlock();

    expect(document.body.classList.contains('ce-scroll-locked--hard')).toBe(false);
    expect(scrollTo).toHaveBeenCalledWith(0, storedScroll);
  });

  it('does not restore scroll when hard lock was never applied', () => {
    setIsIosDeviceValue(true);
    const scrollTo = vi.fn();

    window.scrollTo = scrollTo;

    const locker = new ScrollLocker();

    locker.unlock();

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
