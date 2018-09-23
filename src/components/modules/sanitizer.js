/**
 * CodeX Sanitizer
 *
 * @module Sanitizer
 * Clears HTML from taint tags
 *
 * @version 2.0.0
 *
 * @example
 *  Module can be used within two ways:
 *     1) When you have an instance
 *         - this.Editor.Sanitizer.clean(yourTaintString);
 *     2) As static method
 *         - CodexEditor.Sanitizer.clean(yourTaintString, yourCustomConfiguration);
 *
 * {@link SanitizerConfig}
 */


/**
 * @typedef {Object} SanitizerConfig
 * @property {Object} tags - define tags restrictions
 *
 * @example
 *
 * tags : {
 *     p: true,
 *     a: {
 *       href: true,
 *       rel: "nofollow",
 *       target: "_blank"
 *     }
 * }
 */
export default class Sanitizer extends Module {
  /**
   * Initializes Sanitizer module
   * Sets default configuration if custom not exists
   *
   * @property {SanitizerConfig} this.defaultConfig
   * @property {HTMLJanitor} this._sanitizerInstance - Sanitizer library
   *
   * @param {SanitizerConfig} config
   */
  constructor({config}) {
    super({config});

    // default config
    this.defaultConfig = null;
    this._sanitizerInstance = null;

    /** Custom configuration */
    this.sanitizerConfig = config.settings ? config.settings.sanitizer : {};

    /** HTML Janitor library */
    this.sanitizerInstance = require('html-janitor');
  }

  /**
   * If developer uses editor's API, then he can customize sanitize restrictions.
   * Or, sanitizing config can be defined globally in editors initialization. That config will be used everywhere
   * At least, if there is no config overrides, that API uses Default configuration
   *
   * @uses https://www.npmjs.com/package/html-janitor
   *
   * @param {HTMLJanitor} library - sanitizer extension
   */
  set sanitizerInstance(library) {
    this._sanitizerInstance = new library(this.defaultConfig);
  }

  /**
   * Sets sanitizer configuration. Uses default config if user didn't pass the restriction
   * @param {SanitizerConfig} config
   */
  set sanitizerConfig(config) {
    if (_.isEmpty(config)) {
      this.defaultConfig = {
        tags: {
          p: {},
          a: {
            href: true,
            target: '_blank',
            rel: 'nofollow'
          },
          b: {},
          i: {}
        }
      };
    } else {
      this.defaultConfig = config;
    }
  }

  /**
   * Cleans string from unwanted tags
   * @param {String} taintString - HTML string
   * @param {Object} customConfig - custom sanitizer configuration. Method uses default if param is empty
   * @return {String} clean HTML
   */
  clean(taintString, customConfig = {}) {
    if (_.isEmpty(customConfig)) {
      return this._sanitizerInstance.clean(taintString);
    } else {
      /**
       * API client can use custom config to manage sanitize process
       * In this case we merge default config with custom, each rule can be rewritten by custom
       */
      this.defaultConfig.tags = Object.assign(this.defaultConfig.tags, customConfig);
      return Sanitizer.clean(taintString, this.defaultConfig);
    }
  }

  /**
   * Cleans string from unwanted tags
   * @static
   *
   * Method allows to use default config
   *
   * @param {String} taintString - taint string
   * @param {SanitizerConfig} customConfig - allowed tags
   *
   * @return {String} clean HTML
   */
  static clean(taintString, customConfig) {
    let newInstance = new Sanitizer({
      config: {
        settings: {
          sanitizer: customConfig
        }
      }
    });

    return newInstance.clean(taintString);
  }
}
