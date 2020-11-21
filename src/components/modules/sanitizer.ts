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
 *         - EditorJS.Sanitizer.clean(yourTaintString, yourCustomConfiguration);
 *
 * {@link SanitizerConfig}
 */

import Module from '../__module';
import * as _ from '../utils';

/**
 * @typedef {object} SanitizerConfig
 * @property {object} tags - define tags restrictions
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

import HTMLJanitor from 'html-janitor';
import { BlockToolData, InlineToolConstructable, SanitizerConfig } from '../../../types';
import { SavedData } from '../../../types/data-formats';

/**
 *
 */
export default class Sanitizer extends Module {
  /**
   * Memoize tools config
   */
  private configCache: {[toolName: string]: SanitizerConfig} = {};

  /**
   * Cached inline tools config
   */
  private inlineToolsConfigCache: SanitizerConfig | null = null;

  /**
   * Sanitize Blocks
   *
   * Enumerate blocks and clean data
   *
   * @param {Array<{tool, data: BlockToolData}>} blocksData - blocks' data to sanitize
   */
  public sanitizeBlocks(
    blocksData: Array<Pick<SavedData, 'data' | 'tool'>>
  ): Array<Pick<SavedData, 'data' | 'tool'>> {
    return blocksData.map((block) => {
      const toolConfig = this.composeToolConfig(block.tool);

      if (_.isEmpty(toolConfig)) {
        return block;
      }

      block.data = this.deepSanitize(block.data, toolConfig) as BlockToolData;

      return block;
    });
  }

  /**
   * Method recursively reduces Block's data and cleans with passed rules
   *
   * @param {BlockToolData|object|*} dataToSanitize - taint string or object/array that contains taint string
   * @param {SanitizerConfig} rules - object with sanitizer rules
   */
  public deepSanitize(dataToSanitize: object | string, rules: SanitizerConfig): object | string {
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
    } else if (_.isObject(dataToSanitize)) {
      /**
       * Objects: just clean object deeper.
       */
      return this.cleanObject(dataToSanitize, rules);
    } else {
      /**
       * Primitives (number|string|boolean): clean this item
       *
       * Clean only strings
       */
      if (_.isString(dataToSanitize)) {
        return this.cleanOneItem(dataToSanitize, rules);
      }

      return dataToSanitize;
    }
  }

  /**
   * Cleans string from unwanted tags
   * Method allows to use default config
   *
   * @param {string} taintString - taint string
   * @param {SanitizerConfig} customConfig - allowed tags
   *
   * @returns {string} clean HTML
   */
  public clean(taintString: string, customConfig: SanitizerConfig = {} as SanitizerConfig): string {
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
   * Merge with inline tool config
   *
   * @param {string} toolName - tool name
   *
   * @returns {SanitizerConfig}
   */
  public composeToolConfig(toolName: string): SanitizerConfig {
    /**
     * If cache is empty, then compose tool config and put it to the cache object
     */
    if (this.configCache[toolName]) {
      return this.configCache[toolName];
    }

    const sanitizeGetter = this.Editor.Tools.INTERNAL_SETTINGS.SANITIZE_CONFIG;
    const toolClass = this.Editor.Tools.available[toolName];
    const baseConfig = this.getInlineToolsConfig(toolName);

    /**
     * If Tools doesn't provide sanitizer config or it is empty
     */
    if (!toolClass.sanitize || (toolClass[sanitizeGetter] && _.isEmpty(toolClass[sanitizeGetter]))) {
      return baseConfig;
    }

    const toolRules = toolClass.sanitize;

    const toolConfig = {} as SanitizerConfig;

    for (const fieldName in toolRules) {
      if (Object.prototype.hasOwnProperty.call(toolRules, fieldName)) {
        const rule = toolRules[fieldName];

        if (_.isObject(rule)) {
          toolConfig[fieldName] = Object.assign({}, baseConfig, rule);
        } else {
          toolConfig[fieldName] = rule;
        }
      }
    }
    this.configCache[toolName] = toolConfig;

    return toolConfig;
  }

  /**
   * Returns Sanitizer config
   * When Tool's "inlineToolbar" value is True, get all sanitizer rules from all tools,
   * otherwise get only enabled
   *
   * @param {string} name - Inline Tool name
   */
  public getInlineToolsConfig(name: string): SanitizerConfig {
    const { Tools } = this.Editor;
    const toolsConfig = Tools.getToolSettings(name);
    const enableInlineTools = toolsConfig.inlineToolbar || [];

    let config = {} as SanitizerConfig;

    if (_.isBoolean(enableInlineTools) && enableInlineTools) {
      /**
       * getting all tools sanitizer rule
       */
      config = this.getAllInlineToolsConfig();
    } else {
      /**
       * getting only enabled
       */
      (enableInlineTools as string[]).map((inlineToolName) => {
        config = Object.assign(
          config,
          Tools.inline[inlineToolName][Tools.INTERNAL_SETTINGS.SANITIZE_CONFIG]
        ) as SanitizerConfig;
      });
    }

    /**
     * Allow linebreaks
     */
    config['br'] = true;
    config['wbr'] = true;

    return config;
  }

  /**
   * Return general config for all inline tools
   */
  public getAllInlineToolsConfig(): SanitizerConfig {
    const { Tools } = this.Editor;

    if (this.inlineToolsConfigCache) {
      return this.inlineToolsConfigCache;
    }

    const config: SanitizerConfig = {} as SanitizerConfig;

    Object.entries(Tools.inline)
      .forEach(([, inlineTool]: [string, InlineToolConstructable]) => {
        Object.assign(config, inlineTool[Tools.INTERNAL_SETTINGS.SANITIZE_CONFIG]);
      });

    this.inlineToolsConfigCache = config;

    return this.inlineToolsConfigCache;
  }

  /**
   * Clean array
   *
   * @param {Array} array - [1, 2, {}, []]
   * @param {SanitizerConfig} ruleForItem - sanitizer config for array
   */
  private cleanArray(array: Array<object | string>, ruleForItem: SanitizerConfig): Array<object | string> {
    return array.map((arrayItem) => this.deepSanitize(arrayItem, ruleForItem));
  }

  /**
   * Clean object
   *
   * @param {object} object  - {level: 0, text: 'adada', items: [1,2,3]}}
   * @param {object} rules - { b: true } or true|false
   * @returns {object}
   */
  private cleanObject(object: object, rules: SanitizerConfig|{[field: string]: SanitizerConfig}): object {
    const cleanData = {};

    for (const fieldName in object) {
      if (!Object.prototype.hasOwnProperty.call(object, fieldName)) {
        continue;
      }

      const currentIterationItem = object[fieldName];

      /**
       *  Get object from config by field name
       *   - if it is a HTML Janitor rule, call with this rule
       *   - otherwise, call with parent's config
       */
      const ruleForItem = this.isRule(rules[fieldName] as SanitizerConfig) ? rules[fieldName] : rules;

      cleanData[fieldName] = this.deepSanitize(currentIterationItem, ruleForItem as SanitizerConfig);
    }

    return cleanData;
  }

  /**
   * Clean primitive value
   *
   * @param {string} taintString - string to clean
   * @param {SanitizerConfig|boolean} rule - sanitizer rule
   *
   * @returns {string}
   */
  private cleanOneItem(taintString: string, rule: SanitizerConfig|boolean): string {
    if (_.isObject(rule)) {
      return this.clean(taintString, rule);
    } else if (rule === false) {
      return this.clean(taintString, {} as SanitizerConfig);
    } else {
      return taintString;
    }
  }

  /**
   * Check if passed item is a HTML Janitor rule:
   *  { a : true }, {}, false, true, function(){} — correct rules
   *  undefined, null, 0, 1, 2 — not a rules
   *
   * @param {SanitizerConfig} config - config to check
   */
  private isRule(config: SanitizerConfig): boolean {
    return _.isObject(config) || _.isBoolean(config) || _.isFunction(config);
  }

  /**
   * If developer uses editor's API, then he can customize sanitize restrictions.
   * Or, sanitizing config can be defined globally in editors initialization. That config will be used everywhere
   * At least, if there is no config overrides, that API uses Default configuration
   *
   * @see {@link https://www.npmjs.com/package/html-janitor}
   * @license Apache-2.0
   * @see {@link https://github.com/guardian/html-janitor/blob/master/LICENSE}
   *
   * @param {SanitizerConfig} config - sanitizer extension
   */
  private createHTMLJanitorInstance(config: {tags: SanitizerConfig}): HTMLJanitor|null {
    if (config) {
      return new HTMLJanitor(config);
    }

    return null;
  }
}
