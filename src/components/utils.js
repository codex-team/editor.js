/**
 * Codex Editor Util
 */
export default class Util {
  /**
   * Custom logger
   *
   * @param {string} msg  - message
   * @param {string} type - logging type 'log'|'warn'|'error'|'info'
   * @param {*} args      - argument to log with a message
   */
  static log(msg, type, args) {
    type = type || 'log';

    if (!args) {
      args  = msg || 'undefined';
      msg  = '[codex-editor]:      %o';
    } else {
      msg  = '[codex-editor]:      ' + msg;
    }

    try{
      if ( 'console' in window && window.console[ type ] ) {
        if ( args ) window.console[ type ]( msg, args );
        else window.console[ type ]( msg );
      }
    } catch(e) {
      // do nothing
    }
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
      META: 91
    };
  }

  /**
   * @typedef {Object} ChainData
   * @property {Object} data - data that will be passed to the success or fallback
   * @property {Function} function - function's that must be called asynchronically
   */

  /**
   * Fires a promise sequence asyncronically
   *
   * @param {Object[]} chains - list or ChainData's
   * @param {Function} success - success callback
   * @param {Function} fallback - callback that fires in case of errors
   *
   * @return {Promise}
   */
  static sequence(chains, success = () => {}, fallback = () => {}) {
    return new Promise(function (resolve) {
      /**
       * pluck each element from queue
       * First, send resolved Promise as previous value
       * Each plugins "prepare" method returns a Promise, that's why
       * reduce current element will not be able to continue while can't get
       * a resolved Promise
       */
      chains.reduce(function (previousValue, currentValue, iteration) {
        return previousValue
          .then(() => waitNextBlock(currentValue, success, fallback))
          .then(() => {
            // finished
            if (iteration === chains.length - 1) {
              resolve();
            }
          });
      }, Promise.resolve());
    });

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
    function waitNextBlock(chainData, successCallback, fallbackCallback) {
      return new Promise(function (resolve) {
        chainData.function()
          .then(() => {
            successCallback(chainData.data || {});
          })
          .then(resolve)
          .catch(function () {
            fallbackCallback(chainData.data || {});

            // anyway, go ahead even it falls
            resolve();
          });
      });
    }
  }

  /**
   * Make array from array-like collection
   *
   * @param {*} collection
   *
   * @return {Array}
   */
  static array(collection) {
    return Array.prototype.slice.call(collection);
  }

  /**
   * Checks if object is empty
   *
   * @param {Object} object
   * @return {boolean}
   */
  static isEmpty(object) {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  /**
   * Check if passed object is a Promise
   * @param  {*}  object - object to check
   * @return {Boolean}
   */
  static isPromise(object) {
    return Promise.resolve(object) === object;
  }

  /**
   * Check if passed element is contenteditable
   * @param element
   * @return {boolean}
   */
  static isContentEditable(element) {
    return element.contentEditable === 'true';
  }

  /**
   * Delays method execution
   *
   * @param method
   * @param timeout
   */
  static delay(method, timeout) {
    return function () {
      let context = this,
        args    = arguments;

      window.setTimeout(() => method.apply(context, args), timeout);
    };
  }
};
