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
import IBlockToolData from '../interfaces/tools/block-tool-data';
import IInlineTool from '../interfaces/tools/inline-tool';

export default class Sanitizer extends Module {
  /**
   * Memoize tools config
   */
  private configCache: {[toolName: string]: ISanitizerConfig} = {};

  /**
   * Cached inline tools config
   */
  private inlineToolsConfigCache: ISanitizerConfig | null = null;

  /**
   * Initializes Sanitizer module
   * Sets default configuration if custom not exists
   *
   * @property {HTMLJanitor} this._sanitizerInstance - Sanitizer library
   *
   * @param {IEditorConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Sanitize Blocks
   *
   * Enumerate blocks and clean data
   *
   * @param {{tool, data: IBlockToolData}[]} blocksData[]
   */
  public sanitizeBlocks(
    blocksData: Array<{tool: string, data: IBlockToolData}>,
  ): Array<{tool: string, data: IBlockToolData}> {

    return blocksData.map((block) => {
      const toolConfig = this.composeToolConfig(block.tool);

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
  public deepSanitize(dataToSanitize: any, rules: ISanitizerConfig): any {
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
  public clean(taintString: string, customConfig: ISanitizerConfig = {}): string {

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
   * @param {string} toolName
   * @param {ISanitizerConfig} toolRules
   * @return {ISanitizerConfig}
   */
  public composeToolConfig(toolName: string): ISanitizerConfig {
    /**
     * If cache is empty, then compose tool config and put it to the cache object
     */
    if (this.configCache[toolName]) {
      return this.configCache[toolName];
    }

    const sanitizeGetter = this.Editor.Tools.apiSettings.SANITIZE_CONFIG;
    const toolClass = this.Editor.Tools.toolsAvailable[toolName];

    /**
     * If Tools doesn't provide sanitizer config or it is empty
     */
    if (!toolClass.sanitize || (toolClass[sanitizeGetter] && _.isEmpty(toolClass[sanitizeGetter]))) {
      return {};
    }

    const toolRules = toolClass.sanitize;
    const baseConfig = this.getInlineToolsConfig(toolName);

    const toolConfig = {};
    for (const fieldName in toolRules) {
      if (toolRules.hasOwnProperty(fieldName)) {
        const rule = toolRules[fieldName];
        if (typeof rule === 'object') {
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
   */
  public getInlineToolsConfig(name: string): ISanitizerConfig {
    const {Tools} = this.Editor;

    const toolsConfig = Tools.getToolSettings(name),
      enableInlineTools = toolsConfig.inlineToolbar || [];

    let config = {};

    if (typeof enableInlineTools === 'boolean' && enableInlineTools) {
      /**
       * getting all tools sanitizer rule
       */
      config = this.getAllInlineToolsConfig();
    } else {
      /**
       * getting only enabled
       */
      enableInlineTools.map( (inlineToolName) => {
        config = Object.assign(config, Tools.inline[inlineToolName][Tools.apiSettings.SANITIZE_CONFIG]);
      });
    }

    return config;
  }

  /**
   * Return general config for all inline tools
   */
  public getAllInlineToolsConfig(): ISanitizerConfig {
    const {Tools} = this.Editor;

    if (this.inlineToolsConfigCache) {
      return this.inlineToolsConfigCache;
    }

    const config: ISanitizerConfig = {};

    Object.entries(Tools.inline)
      .forEach( ([name, inlineTool]: [string, IInlineTool]) => {
      Object.assign(config, inlineTool[Tools.apiSettings.SANITIZE_CONFIG]);
    });

    this.inlineToolsConfigCache = config;

    return this.inlineToolsConfigCache;
  }

  /**
   * Clean array
   * @param {array} array - [1, 2, {}, []]
   * @param {object} ruleForItem
   */
  private cleanArray(array: any[], ruleForItem: ISanitizerConfig): any[] {
    return array.map( (arrayItem) => this.deepSanitize(arrayItem, ruleForItem));
  }

  /**
   * Clean object
   * @param {object} object  - {level: 0, text: 'adada', items: [1,2,3]}}
   * @param {object} rules - { b: true } or true|false
   * @return {object}
   */
  private cleanObject(object: any, rules: ISanitizerConfig|{[field: string]: ISanitizerConfig}): any {
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
      const ruleForItem = this.isRule(rules[fieldName] as ISanitizerConfig) ? rules[fieldName] : rules;

      cleanData[fieldName] = this.deepSanitize(currentIterationItem, ruleForItem as ISanitizerConfig);
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
  private isRule(config: ISanitizerConfig): boolean {
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
  private createHTMLJanitorInstance(config: {tags: ISanitizerConfig}): any {
    if (config) {
      return new HTMLJanitor(config);
    }
    return null;
  }
}
