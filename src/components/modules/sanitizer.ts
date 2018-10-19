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
import {hasOwnProperty} from 'tslint/lib/utils';

export default class Sanitizer extends Module {
  /**
   * Memoize tools config
   */
  private configCache: {[toolName: string]: ISanitizerConfig} = {};

  /**
   * Initializes Sanitizer module
   * Sets default configuration if custom not exists
   *
   * @property {SanitizerConfig} this.defaultConfig
   * @property {HTMLJanitor} this._sanitizerInstance - Sanitizer library
   *
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Sets sanitizer configuration. Uses default config if user didn't pass the restriction
   */
  get defaultConfig() {
    return {
      p: {},
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
      b: {},
      i: {},
    };
  }

  /**
   * Sanitize Blocks
   *
   * Enumerate blocks and clean data
   *
   * @param {{tool, data: IBlockToolData}[]} blocksData[]
   */
  public sanitizeBlocks(blocksData) {
    let toolClass;

    return blocksData.map((block) => {
      toolClass = this.Editor.Tools.toolsAvailable[block.tool];

      /**
       * If Tools doesn't provide sanitizer config or it is empty
       */
      if (!toolClass.sanitize || (toolClass.sanitize && _.isEmpty(toolClass.sanitize))) {
        return block;
      }

      /**
       * If cache is empty, then compose tool config and put it to the cache object
       */
      if (!this.configCache[block.tool]) {
        this.configCache[block.tool] = this.composeToolConfig(block.tool, toolClass.sanitize);
      }

      /**
       * get from cache
       */
      const toolConfig = this.configCache[block.tool];
      block.data = this.deepSanitize(block.data, toolConfig);

      return block;
    });
  }

  /**
   * Method recursively reduces Block's data and cleans with passed rules
   *
   * @param {IBlockToolData|object|*} dataToSanitize - taint string or object/array that contains taint string
   * @param {ISanitizerConfig} rules - object with sanitizer rules
   */
  public deepSanitize(dataToSanitize, rules) {
    /**
     * BlockData It may contain 3 types:
     *  - Array
     *  - Object
     *  - Primitive
     */
    if (Array.isArray(dataToSanitize)) {
      /**
       * Array: call sanitize for each item
       */
      return this.cleanArray(dataToSanitize, rules);
    } else if (typeof dataToSanitize === 'object') {
      /**
       * Objects: just clean object deeper.
       */
      return this.cleanObject(dataToSanitize, rules);
    } else {
      /**
       * Primitives (number|string|boolean): clean this item
       */
      return this.cleanOneItem(dataToSanitize, rules);
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
  public clean(taintString: string, customConfig: ISanitizerConfig): string {

    const sanitizerConfig = {
      tags: customConfig,
    };

    /**
     * API client can use custom config to manage sanitize process
     */
    const sanitizerInstance = this.createHTMLJanitorInstance(sanitizerConfig);
    return sanitizerInstance.clean(taintString);
  }

  /**
   * Clean array
   * @param {array} array - [1, 2, {}, []]
   * @param {object} ruleForItem
   */
  private cleanArray(array, ruleForItem) {
    return array.map( (arrayItem) => this.deepSanitize(arrayItem, ruleForItem));
  }

  /**
   * Clean object
   * @param {object} object  - {level: 0, text: 'adada', items: [1,2,3]}}
   * @param {object} rules - { b: true } or true|false
   * @return {object}
   */
  private cleanObject(object, rules) {
    const cleanData = {};

    for (const fieldName in object) {
      if (!object.hasOwnProperty(fieldName)) {
        continue;
      }

      const currentIterationItem = object[fieldName];

      /**
       *  Get object from config by field name
       *   - if it is a HTML Janitor rule, call with this rule
       *   - otherwise, call with parent's config
       */
      const ruleForItem = this.isRule(rules[fieldName]) ? rules[fieldName] : rules;

      cleanData[fieldName] = this.deepSanitize(currentIterationItem, ruleForItem);
    }
    return cleanData;
  }

  /**
   * @param {string} taintString
   * @param {ISanitizerConfig|boolean} rule
   * @return {string}
   */
  private cleanOneItem(taintString: string, rule: ISanitizerConfig|boolean): string {
    if (typeof rule === 'object') {
      return this.clean(taintString, rule);
    } else if (rule === false) {
      return this.clean(taintString, {});
    } else {
      return taintString;
    }
  }



  /**
   * Check if passed item is a HTML Janitor rule:
   *  { a : true }, {}, false, true, function(){} — correct rules
   *  undefined, null, 0, 1, 2 — not a rules
   * @param config
   */
  private isRule(config): boolean {
    return typeof config === 'object' || typeof config === 'boolean' || typeof config === 'function';
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
      return new HTMLJanitor(config);
    }
    return null;
  }

  /**
   * Merge with inline tool config
   *
   * @param {string} toolName
   * @param {ISanitizerConfig} toolRules
   * @return {ISanitizerConfig}
   */
  private composeToolConfig(toolName: string, toolRules: ISanitizerConfig): ISanitizerConfig {
    const baseConfig = this.getInlineToolsConfig(toolName);

    const toolConfig = {};
    for (const toolRule in toolRules) {
      if (typeof toolRules[toolRule] === 'object') {
        toolConfig[toolRule] = Object.assign({}, baseConfig, toolRules[toolRule]);
      } else {
        toolConfig[toolRule] = toolRules[toolRule];
      }
    }
    return toolConfig;
  }

  /**
   * Returns Sanitizer config
   * When Tool's "inlineToolbar" value is True, get all sanitizer rules from all tools,
   * otherwise get only enabled
   */
  private getInlineToolsConfig(name) {
    const toolsConfig = this.Editor.Tools.getToolSettings(name),
      enableInlineTools = toolsConfig.inlineToolbar || [];

    let config = {};

    if (typeof enableInlineTools === 'boolean' && enableInlineTools) {
      /**
       * getting all tools sanitizer rule
       */
      this.Editor.InlineToolbar.tools.forEach( (inlineTool) => {
        config = Object.assign(config, inlineTool.sanitize);
      });
    } else {
      /**
       * getting only enabled
       */
      enableInlineTools.map( (inlineToolName) => {
        config = Object.assign(config, this.Editor.InlineToolbar.tools.get(inlineToolName).sanitize);
      });
    }

    return config;
  }
}
