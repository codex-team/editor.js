/**
 * Class Util
 */

import Dom from './dom';

/**
 * Possible log levels
 */
export enum LogLevels {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Allow to use global VERSION, that will be overwritten by Webpack
 */
declare const VERSION: string;

/**
 * @typedef {object} ChainData
 * @property {object} data - data that will be passed to the success or fallback
 * @property {Function} function - function's that must be called asynchronously
 *
 * @interface ChainData
 */
export interface ChainData {
  data?: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function: (...args: any[]) => any;
}

/**
 * Editor.js utils
 */

/**
 * Returns basic keycodes as constants
 *
 * @returns {{}}
 */
export const keyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
};

/**
 * Return mouse buttons codes
 */
export const mouseButtons = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4,
};

/**
 * Custom logger
 *
 * @param {boolean} labeled — if true, Editor.js label is shown
 * @param {string} msg  - message
 * @param {string} type - logging type 'log'|'warn'|'error'|'info'
 * @param {*} [args]      - argument to log with a message
 * @param {string} style  - additional styling to message
 */
function _log(
  labeled: boolean,
  msg: string,
  type = 'log',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any,
  style = 'color: inherit'
): void {
  if (!('console' in window) || !window.console[type]) {
    return;
  }

  const isSimpleType = ['info', 'log', 'warn', 'error'].includes(type);
  const argsToPass = [];

  switch (_log.logLevel) {
    case LogLevels.ERROR:
      if (type !== 'error') {
        return;
      }
      break;

    case LogLevels.WARN:
      if (!['error', 'warn'].includes(type)) {
        return;
      }
      break;

    case LogLevels.INFO:
      if (!isSimpleType || labeled) {
        return;
      }
      break;
  }

  if (args) {
    argsToPass.push(args);
  }

  const editorLabelText = `Editor.js ${VERSION}`;
  const editorLabelStyle = `line-height: 1em;
            color: #006FEA;
            display: inline-block;
            font-size: 11px;
            line-height: 1em;
            background-color: #fff;
            padding: 4px 9px;
            border-radius: 30px;
            border: 1px solid rgba(56, 138, 229, 0.16);
            margin: 4px 5px 4px 0;`;

  if (labeled) {
    if (isSimpleType) {
      argsToPass.unshift(editorLabelStyle, style);
      msg = `%c${editorLabelText}%c ${msg}`;
    } else {
      msg = `( ${editorLabelText} )${msg}`;
    }
  }

  try {
    if (!isSimpleType) {
      console[type](msg);
    } else if (args) {
      console[type](`${msg} %o`, ...argsToPass);
    } else {
      console[type](msg, ...argsToPass);
    }
  } catch (ignored) {}
}

/**
 * Current log level
 */
_log.logLevel = LogLevels.VERBOSE;

/**
 * Set current log level
 *
 * @param {LogLevels} logLevel - log level to set
 */
export function setLogLevel(logLevel: LogLevels): void {
  _log.logLevel = logLevel;
}

/**
 * _log method proxy without Editor.js label
 */
export const log = _log.bind(window, false);

/**
 * _log method proxy with Editor.js label
 */
export const logLabeled = _log.bind(window, true);

/**
 * Return string representation of the object type
 *
 * @param {*} object - object to get type
 *
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typeOf(object: any): string {
  return Object.prototype.toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

/**
 * Check if passed variable is a function
 *
 * @param {*} fn - function to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction(fn: any): fn is Function {
  return typeOf(fn) === 'function';
}

/**
 * Checks if passed argument is an object
 *
 * @param {*} v - object to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(v: any): v is object {
  return typeOf(v) === 'object';
}

/**
 * Checks if passed argument is a string
 *
 * @param {*} v - variable to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString(v: any): v is string {
  return typeOf(v) === 'string';
}

/**
 * Checks if passed argument is boolean
 *
 * @param {*} v - variable to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoolean(v: any): v is boolean {
  return typeOf(v) === 'boolean';
}

/**
 * Checks if passed argument is number
 *
 * @param {*} v - variable to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(v: any): v is number {
  return typeOf(v) === 'number';
}

/**
 * Checks if passed argument is undefined
 *
 * @param {*} v - variable to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUndefined(v: any): v is undefined {
  return typeOf(v) === 'undefined';
}

/**
 * Check if passed function is a class
 *
 * @param {Function} fn - function to check
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isClass(fn: any): boolean {
  return isFunction(fn) && /^\s*class\s+/.test(fn.toString());
}

/**
 * Checks if object is empty
 *
 * @param {object} object - object to check
 *
 * @returns {boolean}
 */
export function isEmpty(object: object): boolean {
  if (!object) {
    return true;
  }

  return Object.keys(object).length === 0 && object.constructor === Object;
}

/**
 * Check if passed object is a Promise
 *
 * @param  {*}  object - object to check
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(object: any): object is Promise<any> {
  return Promise.resolve(object) === object;
}

/**
 * Returns true if passed key code is printable (a-Z, 0-9, etc) character.
 *
 * @param {number} keyCode - key code
 *
 * @returns {boolean}
 */
export function isPrintableKey(keyCode: number): boolean {
  return (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 || keyCode === 13 || // Spacebar & return key(s)
    keyCode === 229 || // processing key input for certain languages — Chinese, Japanese, etc.
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // Numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223); // [\]' (in order)
}

/**
 * Fires a promise sequence asynchronously
 *
 * @param {ChainData[]} chains - list or ChainData's
 * @param {Function} success - success callback
 * @param {Function} fallback - callback that fires in case of errors
 *
 * @returns {Promise}
 */
export async function sequence(
  chains: ChainData[],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  success: (data: object) => void = (): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fallback: (data: object) => void = (): void => {}
): Promise<void> {
  /**
   * Decorator
   *
   * @param {ChainData} chainData - Chain data
   *
   * @param {Function} successCallback - success callback
   * @param {Function} fallbackCallback - fail callback
   *
   * @returns {Promise}
   */
  async function waitNextBlock(
    chainData: ChainData,
    successCallback: (data: object) => void,
    fallbackCallback: (data: object) => void
  ): Promise<void> {
    try {
      await chainData.function(chainData.data);
      await successCallback(!isUndefined(chainData.data) ? chainData.data : {});
    } catch (e) {
      fallbackCallback(!isUndefined(chainData.data) ? chainData.data : {});
    }
  }

  /**
   * pluck each element from queue
   * First, send resolved Promise as previous value
   * Each plugins "prepare" method returns a Promise, that's why
   * reduce current element will not be able to continue while can't get
   * a resolved Promise
   */
  return chains.reduce(async (previousValue, currentValue) => {
    await previousValue;

    return waitNextBlock(currentValue, success, fallback);
  }, Promise.resolve());
}

/**
 * Make array from array-like collection
 *
 * @param {ArrayLike} collection - collection to convert to array
 *
 * @returns {Array}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function array(collection: ArrayLike<any>): any[] {
  return Array.prototype.slice.call(collection);
}

/**
 * Delays method execution
 *
 * @param {Function} method - method to execute
 * @param {number} timeout - timeout in ms
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delay(method: (...args: any[]) => any, timeout: number) {
  return function (): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
        // eslint-disable-next-line prefer-rest-params
        args = arguments;

    window.setTimeout(() => method.apply(context, args), timeout);
  };
}

/**
 * Get file extension
 *
 * @param {File} file - file
 *
 * @returns {string}
 */
export function getFileExtension(file: File): string {
  return file.name.split('.').pop();
}

/**
 * Check if string is MIME type
 *
 * @param {string} type - string to check
 *
 * @returns {boolean}
 */
export function isValidMimeType(type: string): boolean {
  return /^[-\w]+\/([-+\w]+|\*)$/.test(type);
}

/**
 * Debouncing method
 * Call method after passed time
 *
 * Note that this method returns Function and declared variable need to be called
 *
 * @param {Function} func - function that we're throttling
 * @param {number} wait - time in milliseconds
 * @param {boolean} immediate - call now
 * @returns {Function}
 */
export function debounce(func: () => void, wait?: number, immediate?: boolean): () => void {
  let timeout;

  return (): void => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
        // eslint-disable-next-line prefer-rest-params
        args = arguments;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Copies passed text to the clipboard
 *
 * @param text - text to copy
 */
export function copyTextToClipboard(text): void {
  const el = Dom.make('div', 'codex-editor-clipboard', {
    innerHTML: text,
  });

  document.body.appendChild(el);

  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNode(el);

  window.getSelection().removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  document.body.removeChild(el);
}

/**
 * Returns object with os name as key and boolean as value. Shows current user OS
 */
export function getUserOS(): {[key: string]: boolean} {
  const OS = {
    win: false,
    mac: false,
    x11: false,
    linux: false,
  };

  const userOS = Object.keys(OS).find((os: string) => navigator.appVersion.toLowerCase().indexOf(os) !== -1);

  if (userOS) {
    OS[userOS] = true;

    return OS;
  }

  return OS;
}

/**
 * Capitalizes first letter of the string
 *
 * @param {string} text - text to capitalize
 *
 * @returns {string}
 */
export function capitalize(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

/**
 * Merge to objects recursively
 *
 * @param {object} target - merge target
 * @param {object[]} sources - merge sources
 * @returns {object}
 */
export function deepMerge<T extends object>(target, ...sources): T {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Return true if current device supports touch events
 *
 * Note! This is a simple solution, it can give false-positive results.
 * To detect touch devices more carefully, use 'touchstart' event listener
 *
 * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
 *
 * @returns {boolean}
 */
export const isTouchSupported: boolean = 'ontouchstart' in document.documentElement;

/**
 * Make shortcut command more human-readable
 *
 * @param {string} shortcut — string like 'CMD+B'
 */
export function beautifyShortcut(shortcut: string): string {
  const OS = getUserOS();

  shortcut = shortcut
    .replace(/shift/gi, '⇧')
    .replace(/backspace/gi, '⌫')
    .replace(/enter/gi, '⏎')
    .replace(/up/gi, '↑')
    .replace(/left/gi, '→')
    .replace(/down/gi, '↓')
    .replace(/right/gi, '←')
    .replace(/escape/gi, '⎋')
    .replace(/insert/gi, 'Ins')
    .replace(/delete/gi, '␡')
    .replace(/\+/gi, ' + ');

  if (OS.mac) {
    shortcut = shortcut.replace(/ctrl|cmd/gi, '⌘').replace(/alt/gi, '⌥');
  } else {
    shortcut = shortcut.replace(/cmd/gi, 'Ctrl').replace(/windows/gi, 'WIN');
  }

  return shortcut;
}

/**
 * Returns valid URL. If it is going outside and valid, it returns itself
 * If url has `one slash`, then it concatenates with window location origin
 * or when url has `two lack` it appends only protocol
 *
 * @param {string} url - url to prettify
 */
export function getValidUrl(url: string): string {
  try {
    const urlObject = new URL(url);

    return urlObject.href;
  } catch (e) {
    // do nothing but handle below
  }

  if (url.substring(0, 2) === '//') {
    return window.location.protocol + url;
  } else {
    return window.location.origin + url;
  }
}

/**
 * Opens new Tab with passed URL
 *
 * @param {string} url - URL address to redirect
 */
export function openTab(url: string): void {
  window.open(url, '_blank');
}

/**
 * Returns random generated identifier
 *
 * @param {string} prefix - identifier prefix
 *
 * @returns {string}
 */
export function generateId(prefix = ''): string {
  // tslint:disable-next-line:no-bitwise
  return `${prefix}${(Math.floor(Math.random() * 1e8)).toString(16)}`;
}

/**
 * Common method for printing a warning about the usage of deprecated property or method.
 *
 * @param condition - condition for deprecation.
 * @param oldProperty - deprecated property.
 * @param newProperty - the property that should be used instead.
 */
export function deprecationAssert(condition: boolean, oldProperty: string, newProperty: string): void {
  const message = `«${oldProperty}» is deprecated and will be removed in the next major release. Please use the «${newProperty}» instead.`;

  if (condition) {
    logLabeled(message, 'warn');
  }
}
