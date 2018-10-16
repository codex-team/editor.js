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

import ISanitizerConfig from '../interfaces/sanitizer-config';

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

declare const Module: any;
declare const _: any;

import HTMLJanitor from 'html-janitor';

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

    /** Custom configuration */
    this.sanitizerConfig = config.settings ? config.settings.sanitizer : null;
  }

  /**
   * Sets sanitizer configuration. Uses default config if user didn't pass the restriction
   */
  public get defaultConfig() {
    return {
      tags: {
        p: {},
        a: {
          href: true,
          target: '_blank',
          rel: 'nofollow',
        },
        b: {},
        i: {},
      },
    };
  }

  /**
   * Method recursively reduces Block's data and cleans with passed rules
   *
   * @param {Object|string} blockData - taint string or object/array that contains taint string
   * @param {Object} rules - object with sanitizer rules
   * @param {Object} baseConfig - object with sanitizer rules from inline-tools
   */
  public deepSanitize(blockData, rules, baseConfig) {

    /**
     * Case 1: Block data is Array
     * Array's in JS can not be enumerated with for..in because result will be Object not Array
     * which conflicts with Consistency
     */
    if (Array.isArray(blockData)) {
      /**
       * Create new "cleanData" array and fill in with sanitizer data
       */
      return blockData.map((item) => {
        return this.sanitizeBlock(item, rules, baseConfig);
      });
    } else if (typeof blockData === 'object') {

      /**
       * Create new "cleanData" object and fill with sanitized objects
       */
      const cleanData = {};

      /**
       * Object's may have 3 cases:
       *  1. When Data is Array. Then call again itself and recursively clean arrays items
       *  2. When Data is Object that can have object's inside. Do the same, call itself and clean recursively
       *  3. When Data is base type (string, int, bool, ...). Check if rule is passed
       */
      for (const data in blockData) {
        if (Array.isArray(blockData[data]) || typeof blockData[data] === 'object') {
          /**
           * Case 1 & Case 2
           */
          if (rules[data]) {
            cleanData[data] = this.sanitizeBlock(blockData[data], rules[data], baseConfig);
          } else if (_.isEmpty(rules)) {
            cleanData[data] = this.sanitizeBlock(blockData[data], rules, baseConfig);
          } else {
            cleanData[data] = blockData[data];
          }

        } else {
          /**
           * Case 3.
           */
          if (rules[data]) {
            cleanData[data] = this.clean(blockData[data], Object.assign(baseConfig, rules[data]));
          } else {
            cleanData[data] = this.clean(blockData[data], Object.assign(baseConfig, rules));
          }
        }
      }

      return cleanData;
    } else {
      /**
       * In case embedded objects use parent rules
       */
      return this.clean(blockData, rules);
    }
  }

  /**
   * Cleans string from unwanted tags
   * Method allows to use default config
   *
   * @param {String} taintString - taint string
   * @param {SanitizerConfig} customConfig - allowed tags
   *
   * @return {String} clean HTML
   */
  public clean(taintString: string, customConfig: ISanitizerConfig) {

    if (customConfig && typeof customConfig === 'object' && _.isEmpty(customConfig)) {
      /**
       * Ignore sanitizing when nothing passed in config
       */
      return taintString;
    }

    /**
     * API client can use custom config to manage sanitize process
     */
    const sanitizerInstance = this.createHTMLJanitorInstance(customConfig);
    return sanitizerInstance.clean(taintString);
  }

  /**
   * If developer uses editor's API, then he can customize sanitize restrictions.
   * Or, sanitizing config can be defined globally in editors initialization. That config will be used everywhere
   * At least, if there is no config overrides, that API uses Default configuration
   *
   * @uses https://www.npmjs.com/package/html-janitor
   *
   * @param {SanitizerConfig} config - sanitizer extension
   */
  private createHTMLJanitorInstance(config) {
    if (config) {
      this._sanitizerInstance = new HTMLJanitor(config);
    }
    return null;
  }

}
