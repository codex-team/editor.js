import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type {
  ChainData } from '../../../src/components/utils';
import {
  isFunction,
  isObject,
  isString,
  isBoolean,
  isNumber,
  isUndefined,
  isEmpty,
  isPrintableKey,
  keyCodes,
  mouseButtons,
  LogLevels,
  setLogLevel,
  log,
  logLabeled,
  array,
  delay,
  debounce,
  throttle,
  sequence,
  getEditorVersion,
  getFileExtension,
  isValidMimeType,
  capitalize,
  deepMerge,
  getUserOS,
  beautifyShortcut,
  getValidUrl,
  generateBlockId,
  generateId,
  openTab,
  deprecationAssert,
  cacheable,
  mobileScreenBreakpoint,
  isMobileScreen,
  isIosDevice,
  equals
} from '../../../src/components/utils';

// Mock VERSION global variable
declare global {
  // eslint-disable-next-line no-var
  var VERSION: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-undef
(globalThis as { VERSION?: string }).VERSION = 'test-version';

/**
 * Unit tests for utils.ts utility functions
 *
 * Tests edge cases and internal functionality not covered by E2E tests
 */
describe('utils', () => {
  beforeEach(() => {
    // Reset log level to VERBOSE before each test
    setLogLevel(LogLevels.VERBOSE);
  });

  describe('getEditorVersion', () => {
    const versionHolder = globalThis as { VERSION?: string };
    const initialVersion = versionHolder.VERSION;

    afterEach(() => {
      if (initialVersion === undefined) {
        delete versionHolder.VERSION;
      } else {
        versionHolder.VERSION = initialVersion;
      }
    });

    it('should return injected VERSION when defined', () => {
      versionHolder.VERSION = '9.9.9';

      expect(getEditorVersion()).toBe('9.9.9');
    });

    it('should fallback to default version when VERSION is not set', () => {
      delete versionHolder.VERSION;

      expect(getEditorVersion()).toBe('dev');
    });
  });

  describe('isFunction', () => {
    it('should return true for regular function', () => {
      const fn = function (): void {};

      expect(isFunction(fn)).toBe(true);
    });

    it('should return true for arrow function', () => {
      const fn = (): void => {};

      expect(isFunction(fn)).toBe(true);
    });

    it('should return true for async function', () => {
      const fn = async (): Promise<void> => {};

      expect(isFunction(fn)).toBe(true);
    });

    it('should return false for object', () => {
      expect(isFunction({})).toBe(false);
    });

    it('should return false for string', () => {
      expect(isFunction('function')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isFunction(123)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isFunction(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for object', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return false for array (arrays have type "array", not "object")', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false for string', () => {
      expect(isObject('test')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isObject(123)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for string', () => {
      expect(isString('test')).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isString('')).toBe(true);
    });

    it('should return false for number', () => {
      expect(isString(123)).toBe(false);
    });

    it('should return false for object', () => {
      expect(isString({})).toBe(false);
    });

    it('should return false for null', () => {
      expect(isString(null)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for true', () => {
      expect(isBoolean(true)).toBe(true);
    });

    it('should return true for false', () => {
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for string', () => {
      expect(isBoolean('true')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isBoolean(1)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for number', () => {
      expect(isNumber(123)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isNumber(0)).toBe(true);
    });

    it('should return true for negative number', () => {
      expect(isNumber(-123)).toBe(true);
    });

    it('should return false for string', () => {
      expect(isNumber('123')).toBe(false);
    });

    it('should return true for NaN (NaN is of type "number")', () => {
      expect(isNumber(NaN)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isNumber(null)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isUndefined(null)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isUndefined('undefined')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isUndefined(0)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for object with properties', () => {
      expect(isEmpty({ key: 'value' })).toBe(false);
    });

    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for object created with Object.create (no constructor)', () => {
      const obj = Object.create(null);

      // lodash isEmpty returns true for objects with no enumerable properties
      expect(isEmpty(obj)).toBe(true);
    });
  });

  describe('isPrintableKey', () => {
    it('should return true for letter keys', () => {
      expect(isPrintableKey(keyCodes.LETTER_KEY_MIN + 1)).toBe(true);
    });

    it('should return true for number keys', () => {
      expect(isPrintableKey(keyCodes.NUMBER_KEY_MIN + 1)).toBe(true);
    });

    it('should return true for space', () => {
      expect(isPrintableKey(keyCodes.SPACE)).toBe(true);
    });

    it('should return true for enter', () => {
      expect(isPrintableKey(keyCodes.ENTER)).toBe(true);
    });

    it('should return true for processing key', () => {
      expect(isPrintableKey(keyCodes.PROCESSING_KEY)).toBe(true);
    });

    it('should return false for control keys', () => {
      expect(isPrintableKey(keyCodes.BACKSPACE)).toBe(false);
      expect(isPrintableKey(keyCodes.TAB)).toBe(false);
      expect(isPrintableKey(keyCodes.ESC)).toBe(false);
      expect(isPrintableKey(keyCodes.LEFT)).toBe(false);
      expect(isPrintableKey(keyCodes.UP)).toBe(false);
      expect(isPrintableKey(keyCodes.DOWN)).toBe(false);
      expect(isPrintableKey(keyCodes.RIGHT)).toBe(false);
    });
  });

  describe('keyCodes', () => {
    it('should have correct key code values', () => {
      expect(keyCodes.BACKSPACE).toBe(8);
      expect(keyCodes.TAB).toBe(9);
      expect(keyCodes.ENTER).toBe(13);
      expect(keyCodes.SPACE).toBe(32);
      expect(keyCodes.ESC).toBe(27);
    });
  });

  describe('mouseButtons', () => {
    it('should have correct mouse button values', () => {
      expect(mouseButtons.LEFT).toBe(0);
      expect(mouseButtons.WHEEL).toBe(1);
      expect(mouseButtons.RIGHT).toBe(2);
      expect(mouseButtons.BACKWARD).toBe(3);
      expect(mouseButtons.FORWARD).toBe(4);
    });
  });

  describe('LogLevels', () => {
    it('should have correct log level values', () => {
      expect(LogLevels.VERBOSE).toBe('VERBOSE');
      expect(LogLevels.INFO).toBe('INFO');
      expect(LogLevels.WARN).toBe('WARN');
      expect(LogLevels.ERROR).toBe('ERROR');
    });
  });

  describe('setLogLevel and logging', () => {
    const consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    };

    beforeEach(() => {
      // Reset spies before each test
      consoleSpy.log.mockClear();
      consoleSpy.warn.mockClear();
      consoleSpy.error.mockClear();
      consoleSpy.info.mockClear();
    });

    afterEach(() => {
      consoleSpy.log.mockClear();
      consoleSpy.warn.mockClear();
      consoleSpy.error.mockClear();
      consoleSpy.info.mockClear();
    });

    it('should log at VERBOSE level', () => {
      setLogLevel(LogLevels.VERBOSE);
      log('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('should not log info at INFO level when labeled', () => {
      setLogLevel(LogLevels.INFO);
      logLabeled('test message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should log errors at ERROR level', () => {
      setLogLevel(LogLevels.ERROR);
      log('test message', 'error');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should not log info at ERROR level', () => {
      setLogLevel(LogLevels.ERROR);
      log('test message', 'log');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should log warnings at WARN level', () => {
      setLogLevel(LogLevels.WARN);
      log('test message', 'warn');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should not log info at WARN level', () => {
      setLogLevel(LogLevels.WARN);
      log('test message', 'log');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('array', () => {
    it('should convert NodeList to array', () => {
      const div = document.createElement('div');

      div.innerHTML = '<span></span><span></span>';
      const nodeList = div.querySelectorAll('span');
      const result = array(nodeList);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should convert HTMLCollection to array', () => {
      const div = document.createElement('div');

      div.innerHTML = '<span></span><span></span>';
      const htmlCollection = div.children;
      const result = array(htmlCollection);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('delay', () => {
    it('should delay function execution', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const delayedFn = delay(fn, 100);

      delayedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should pass arguments to delayed function', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const delayedFn = delay(fn, 100);

      delayedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      vi.useRealTimers();
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call function immediately when immediate is true', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100, true);

      debouncedFn();
      expect(fn).toHaveBeenCalledTimes(1);

      debouncedFn();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not call function on leading edge when leading is false', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100, { leading: false });

      throttledFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call function on trailing edge when trailing is false', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100, { trailing: false });

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      throttledFn();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should return result from throttled function', () => {
      const fn = vi.fn(() => 'result');
      const throttledFn = throttle(fn, 100);

      const result = throttledFn();

      expect(result).toBe('result');
    });
  });

  describe('sequence', () => {
    it('should execute functions in sequence', async () => {
      const results: number[] = [];
      const chains: ChainData[] = [
        {
          data: { order: 1 },
          function: async (...args: unknown[]) => {
            const data = args[0] as { order: number };

            results.push(data.order);
          },
        },
        {
          data: { order: 2 },
          function: async (...args: unknown[]) => {
            const data = args[0] as { order: number };

            results.push(data.order);
          },
        },
      ];

      await sequence(chains);

      expect(results).toEqual([1, 2]);
    });

    it('should call success callback after each chain', async () => {
      const successCallback = vi.fn();
      const chains: ChainData[] = [
        {
          data: { test: 'data' },
          function: async () => {},
        },
      ];

      await sequence(chains, successCallback);

      expect(successCallback).toHaveBeenCalledWith({ test: 'data' });
    });

    it('should call fallback callback on error', async () => {
      const fallbackCallback = vi.fn();
      const chains: ChainData[] = [
        {
          data: { test: 'data' },
          function: async () => {
            throw new Error('test error');
          },
        },
      ];

      await sequence(chains, () => {}, fallbackCallback);

      expect(fallbackCallback).toHaveBeenCalledWith({ test: 'data' });
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      const file = new File([ '' ], 'test.txt');

      expect(getFileExtension(file)).toBe('txt');
    });

    it('should return filename for file without extension', () => {
      const file = new File([ '' ], 'test');

      // When there's no extension, split('.').pop() returns the filename itself
      expect(getFileExtension(file)).toBe('test');
    });

    it('should return last extension for file with multiple dots', () => {
      const file = new File([ '' ], 'test.tar.gz');

      expect(getFileExtension(file)).toBe('gz');
    });
  });

  describe('isValidMimeType', () => {
    it('should return true for valid MIME type', () => {
      expect(isValidMimeType('text/plain')).toBe(true);
      expect(isValidMimeType('image/png')).toBe(true);
      expect(isValidMimeType('application/json')).toBe(true);
      expect(isValidMimeType('text/*')).toBe(true);
    });

    it('should return false for invalid MIME type', () => {
      expect(isValidMimeType('invalid')).toBe(false);
      expect(isValidMimeType('text')).toBe(false);
      expect(isValidMimeType('text/')).toBe(false);
      expect(isValidMimeType('/plain')).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should return empty string when called with empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('deepMerge', () => {
    it('should merge objects shallowly', () => {
      const target = { a: 1 };
      const source: Partial<typeof target & { b: number }> = { b: 2 };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1,
        b: 2 });
    });

    it('should merge objects deeply', () => {
      const target = { a: { b: 1 } };
      const source: Partial<typeof target & { a: { b: number; c: number } }> = {
        a: {
          b: 1,
          c: 2,
        },
      };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: 1,
        c: 2 } });
    });

    it('should merge multiple sources', () => {
      const target = { a: 1 };
      const source1: Partial<typeof target & { b: number }> = { b: 2 };
      const source2: Partial<typeof target & { c: number }> = { c: 3 };

      const result = deepMerge(target, source1, source2);

      expect(result).toEqual({ a: 1,
        b: 2,
        c: 3 });
    });

    it('should not merge arrays', () => {
      const target = { items: [1, 2] };
      const source: Partial<typeof target> = { items: [3, 4] };

      const result = deepMerge(target, source);

      expect(result).toEqual({ items: [3, 4] });
    });

    it('should not merge primitives', () => {
      const target = { value: 'old' };
      const source: Partial<typeof target> = { value: 'new' };

      const result = deepMerge(target, source);

      expect(result).toEqual({ value: 'new' });
    });

    it('should handle null values', () => {
      const target = { value: 'old' as string | null };
      const source: Partial<typeof target> = { value: null };

      const result = deepMerge(target, source);

      expect(result).toEqual({ value: null });
    });

    it('should skip undefined values', () => {
      const target = { value: 'old' };
      const source = { value: undefined };

      const result = deepMerge(target, source);

      // lodash mergeWith skips undefined values (treats them as "not provided")
      expect(result).toEqual({ value: 'old' });
    });
  });

  describe('getUserOS', () => {
    it('should return OS object with all false by default', () => {
      const originalNavigator = navigator;

      Object.defineProperty(window, 'navigator', {
        value: { userAgent: '' },
        configurable: true,
      });

      const os = getUserOS();

      expect(os.win).toBe(false);
      expect(os.mac).toBe(false);
      expect(os.x11).toBe(false);
      expect(os.linux).toBe(false);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    it('should detect Windows OS', () => {
      const originalNavigator = navigator;

      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Windows' },
        configurable: true,
      });

      const os = getUserOS();

      expect(os.win).toBe(true);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    it('should detect Mac OS', () => {
      const originalNavigator = navigator;

      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Mac' },
        configurable: true,
      });

      const os = getUserOS();

      expect(os.mac).toBe(true);

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });
  });

  describe('beautifyShortcut', () => {
    it('should replace shift with ⇧', () => {
      expect(beautifyShortcut('Shift+B')).toContain('⇧');
    });

    it('should replace cmd with ⌘ on Mac', () => {
      const originalNavigator = navigator;

      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Mac' },
        configurable: true,
      });

      const result = beautifyShortcut('Cmd+B');

      expect(result).toContain('⌘');

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    it('should replace cmd with Ctrl on non-Mac', () => {
      const originalNavigator = navigator;

      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Windows' },
        configurable: true,
      });

      const result = beautifyShortcut('Cmd+B');

      expect(result).toContain('Ctrl');

      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    it('should replace arrow keys', () => {
      expect(beautifyShortcut('Up')).toContain('↑');
      expect(beautifyShortcut('Down')).toContain('↓');
      expect(beautifyShortcut('Left')).toContain('→');
      expect(beautifyShortcut('Right')).toContain('←');
    });
  });

  describe('getValidUrl', () => {
    beforeEach(() => {
      // Mock window.location
      delete (window as { location?: Location }).location;
      (window as { location: Location }).location = {
        protocol: 'https:',
        origin: 'https://example.com',
      } as Location;
    });

    it('should return valid URL as-is', () => {
      const url = 'https://example.com/path';

      expect(getValidUrl(url)).toBe(url);
    });

    it('should prepend protocol for double slash URL', () => {
      const url = '//example.com/path';

      expect(getValidUrl(url)).toBe('https://example.com/path');
    });

    it('should prepend origin for single slash URL', () => {
      const url = '/path';

      expect(getValidUrl(url)).toBe('https://example.com/path');
    });
  });

  describe('generateBlockId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateBlockId();
      const id2 = generateBlockId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBe(10);
    });
  });

  describe('generateId', () => {
    it('should generate ID with prefix', () => {
      const id = generateId('test-');

      expect(id).toMatch(/^test-/);
    });

    it('should generate ID without prefix', () => {
      const id = generateId();

      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should generate unique IDs', () => {
      const id1 = generateId('prefix-');
      const id2 = generateId('prefix-');

      expect(id1).not.toBe(id2);
    });
  });

  describe('openTab', () => {
    it('should call window.open with correct parameters', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      openTab('https://example.com');

      expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');

      openSpy.mockRestore();
    });
  });

  describe('deprecationAssert', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    beforeEach(() => {
      consoleWarnSpy.mockClear();
    });

    afterEach(() => {
      consoleWarnSpy.mockClear();
    });

    it('should log warning when condition is true', () => {
      deprecationAssert(true, 'oldProperty', 'newProperty');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls[0]?.[0]).toContain('oldProperty');
      expect(consoleWarnSpy.mock.calls[0]?.[0]).toContain('newProperty');
    });

    it('should not log warning when condition is false', () => {
      deprecationAssert(false, 'oldProperty', 'newProperty');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('cacheable', () => {
    it('should cache method result', () => {
      /**
       *
       */
      class TestClass {
        public callCount = 0;

        /**
         *
         */
        public getValue(): number {
          this.callCount++;

          return 42;
        }
      }

      // Manually apply cacheable decorator
      const descriptor = Object.getOwnPropertyDescriptor(TestClass.prototype, 'getValue');

      if (descriptor) {
        cacheable(TestClass.prototype, 'getValue', descriptor);
        Object.defineProperty(TestClass.prototype, 'getValue', descriptor);
      }

      const instance = new TestClass();

      expect(instance.getValue()).toBe(42);
      expect(instance.callCount).toBe(1);

      expect(instance.getValue()).toBe(42);
      expect(instance.callCount).toBe(1); // Should not increment
    });

    it('should cache getter result', () => {
      /**
       *
       */
      class TestClass {
        public callCount = 0;

        /**
         *
         */
        public get value(): number {
          this.callCount++;

          return 42;
        }
      }

      // Manually apply cacheable decorator
      const descriptor = Object.getOwnPropertyDescriptor(TestClass.prototype, 'value');

      if (descriptor) {
        cacheable(TestClass.prototype, 'value', descriptor);
        Object.defineProperty(TestClass.prototype, 'value', descriptor);
      }

      const instance = new TestClass();

      expect(instance.value).toBe(42);
      expect(instance.callCount).toBe(1);

      expect(instance.value).toBe(42);
      expect(instance.callCount).toBe(1); // Should not increment
    });

    it('should clear cache when setter is called', () => {
      /**
       *
       */
      class TestClass {
        public callCount = 0;
        private _value = 0;

        /**
         *
         */
        public get value(): number {
          this.callCount++;

          return this._value;
        }

        /**
         *
         */
        public set value(val: number) {
          this._value = val;
        }
      }

      // Manually apply cacheable decorator
      const descriptor = Object.getOwnPropertyDescriptor(TestClass.prototype, 'value');

      if (descriptor) {
        cacheable(TestClass.prototype, 'value', descriptor);
        Object.defineProperty(TestClass.prototype, 'value', descriptor);
      }

      const instance = new TestClass();

      expect(instance.value).toBe(0);
      expect(instance.callCount).toBe(1);

      instance.value = 10;

      expect(instance.value).toBe(10);
      expect(instance.callCount).toBe(2);
    });
  });

  describe('mobileScreenBreakpoint', () => {
    it('should equal 650 pixels', () => {
      expect(mobileScreenBreakpoint).toBe(650);
    });
  });

  describe('isMobileScreen', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn(),
      });
    });

    it('should return true for mobile screen', () => {
      (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
        matches: true,
      } as MediaQueryList);

      expect(isMobileScreen()).toBe(true);
    });

    it('should return false for desktop screen', () => {
      (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
        matches: false,
      } as MediaQueryList);

      expect(isMobileScreen()).toBe(false);
    });

    it('should return false when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        configurable: true,
      });

      expect(() => isMobileScreen()).not.toThrow();
      expect(isMobileScreen()).toBe(false);
    });
  });

  describe('isIosDevice', () => {
    it('should be a boolean value', () => {
      expect(typeof isIosDevice).toBe('boolean');
    });
  });

  describe('equals', () => {
    it('should return true for equal primitives', () => {
      expect(equals(1, 1)).toBe(true);
      expect(equals('test', 'test')).toBe(true);
      expect(equals(true, true)).toBe(true);
    });

    it('should return false for unequal primitives', () => {
      expect(equals(1, 2)).toBe(false);
      expect(equals('test', 'test2')).toBe(false);
      expect(equals(true, false)).toBe(false);
    });

    it('should return true for equal objects', () => {
      const obj1 = { a: 1,
        b: 2 };
      const obj2 = { a: 1,
        b: 2 };

      expect(equals(obj1, obj2)).toBe(true);
    });

    it('should return false for unequal objects', () => {
      const obj1 = { a: 1,
        b: 2 };
      const obj2 = { a: 1,
        b: 3 };

      expect(equals(obj1, obj2)).toBe(false);
    });

    it('should return true for equal arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];

      expect(equals(arr1, arr2)).toBe(true);
    });

    it('should return false for unequal arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];

      expect(equals(arr1, arr2)).toBe(false);
    });
  });
});
