/**
 * Class Util
 */

import Dom from './dom';

/**
 * Allow to use global VERSION, that will be overwritten by Webpack
 */
declare const VERSION: string;

/**
 * @typedef {Object} ChainData
 * @property {Object} data - data that will be passed to the success or fallback
 * @property {Function} function - function's that must be called asynchronically
 */
export interface ChainData {
  data?: any;
  function: (...args: any[]) => any;
}

/**
 * Editor.js utils
 */
export default class Util {
  /**
   * Custom logger
   *
   * @param {string} msg  - message
   * @param {string} type - logging type 'log'|'warn'|'error'|'info'
   * @param {*} [args]      - argument to log with a message
   * @param {string} style  - additional styling to message
   */
  public static log(msg: string, type: string = 'log', args?: any, style: string = 'color: inherit'): void {

    if ( !('console' in window) || !window.console[ type ] ) {
      return;
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

    try {
      if (['time', 'timeEnd'].includes(type)) {
        console[type](`( ${editorLabelText} ) ${msg}`);
      } else if (args) {
        console[type](`%c${editorLabelText}%c ${msg} %o`, editorLabelStyle, style, args);
      } else {
        console[type](`%c${editorLabelText}%c ${msg}`, editorLabelStyle, style);
      }
    } catch (ignored) {}
  }

  /**
   * Returns basic keycodes as constants
   * @return {{}}
   */
  static get keyCodes() {
    return {
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
  }

  /**
   * Returns true if passed key code is printable (a-Z, 0-9, etc) character.
   * @param {number} keyCode
   * @return {boolean}
   */
  public static isPrintableKey( keyCode: number ): boolean {
    return (keyCode > 47 && keyCode < 58)   || // number keys
      keyCode === 32 || keyCode === 13   || // Spacebar & return key(s)
      (keyCode > 64 && keyCode < 91)   || // letter keys
      (keyCode > 95 && keyCode < 112)  || // Numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223);   // [\]' (in order)
  }

  /**
   * Fires a promise sequence asyncronically
   *
   * @param {ChainData[]} chains - list or ChainData's
   * @param {Function} success - success callback
   * @param {Function} fallback - callback that fires in case of errors
   *
   * @return {Promise}
   */
  public static async sequence(
    chains: ChainData[],
    success: (data: any) => void = () => {},
    fallback: (data: any) => void = () => {},
  ): Promise<void> {
    /**
     * Decorator
     *
     * @param {ChainData} chainData
     *
     * @param {Function} successCallback
     * @param {Function} fallbackCallback
     *
     * @return {Promise}
     */
    async function waitNextBlock(
      chainData: ChainData,
      successCallback: (data: any) => void,
      fallbackCallback: (data: any) => void,
    ): Promise<void> {
      try {
        await chainData.function(chainData.data);
        await successCallback(typeof chainData.data !== 'undefined' ? chainData.data : {});
      } catch (e) {
        fallbackCallback(typeof chainData.data !== 'undefined' ? chainData.data : {});
      }
    }

    /**
     * pluck each element from queue
     * First, send resolved Promise as previous value
     * Each plugins "prepare" method returns a Promise, that's why
     * reduce current element will not be able to continue while can't get
     * a resolved Promise
     */
    return await chains.reduce(async (previousValue, currentValue) => {
      await previousValue;
      return waitNextBlock(currentValue, success, fallback);
    }, Promise.resolve());
  }

  /**
   * Make array from array-like collection
   *
   * @param {ArrayLike} collection
   *
   * @return {Array}
   */
  public static array(collection: ArrayLike<any>): any[] {
    return Array.prototype.slice.call(collection);
  }

  /**
   * Check if passed variable is a function
   * @param {*} fn
   * @return {boolean}
   */
  public static isFunction(fn: any): boolean {
    return typeof fn === 'function';
  }

  /**
   * Check if passed function is a class
   * @param {function} fn
   * @return {boolean}
   */
  public static isClass(fn: any): boolean {
    return typeof fn === 'function' && /^\s*class\s+/.test(fn.toString());
  }

  /**
   * Checks if object is empty
   *
   * @param {Object} object
   * @return {boolean}
   */
  public static isEmpty(object: object): boolean {
    if (!object) {
      return true;
    }

    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  /**
   * Check if passed object is a Promise
   * @param  {*}  object - object to check
   * @return {Boolean}
   */
  public static isPromise(object: any): boolean {
    return Promise.resolve(object) === object;
  }

  /**
   * Delays method execution
   *
   * @param {Function} method
   * @param {Number} timeout
   */
  public static delay(method: (...args: any[]) => any, timeout: number) {
    return function() {
      const context = this,
        args = arguments;

      window.setTimeout(() => method.apply(context, args), timeout);
    };
  }

  /**
   * Get file extension
   *
   * @param {File} file
   * @return string
   */
  public static getFileExtension(file: File): string {
    return file.name.split('.').pop();
  }

  /**
   * Check if string is MIME type
   *
   * @param {string} type
   * @return boolean
   */
  public static isValidMimeType(type: string): boolean {
    return /^[-\w]+\/([-+\w]+|\*)$/.test(type);
  }

  /**
   * Debouncing method
   * Call method after passed time
   *
   * Note that this method returns Function and declared variable need to be called
   *
   * @param {Function} func - function that we're throttling
   * @param {Number} wait - time in milliseconds
   * @param {Boolean} immediate - call now
   * @return {Function}
   */
  public static debounce(func: () => void, wait?: number , immediate?: boolean): () => void {
    let timeout;

    return () => {
      const context = this,
        args = arguments;

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
   * @param text
   */
  public static copyTextToClipboard(text) {
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
   *
   * @return {[key: string]: boolean}
   */
  public static getUserOS(): {[key: string]: boolean} {
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
   * @param {string} text
   * @return {string}
   */
  public static capitalize(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
  }

  /**
   * Merge to objects recursively
   * @param {object} target
   * @param {object[]} sources
   * @return {object}
   */
  public static deepMerge(target, ...sources) {
    const isObject = (item) => item && Util.typeof(item) === 'object';

    if (!sources.length) { return target; }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }

          Util.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return Util.deepMerge(target, ...sources);
  }

  /**
   * Return true if current device supports touch events
   *
   * Note! This is a simple solution, it can give false-positive results.
   * To detect touch devices more carefully, use 'touchstart' event listener
   * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
   *
   * @return {boolean}
   */
  public static isTouchSupported(): boolean {
    return 'ontouchstart' in document.documentElement;
  }

  /**
   * Return string representation of the object type
   *
   * @param {any} object
   */
  public static typeof(object: any): string {
    return Object.prototype.toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }
}
