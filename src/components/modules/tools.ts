import Paragraph from '../tools/paragraph/dist/bundle';
import Module from '../__module';
import * as _ from '../utils';
import {
  BlockToolConstructable,
  EditorConfig,
  InlineTool,
  InlineToolConstructable, Tool,
  ToolConfig,
  ToolConstructable,
  ToolSettings
} from '../../../types';
import BoldInlineTool from '../inline-tools/inline-tool-bold';
import ItalicInlineTool from '../inline-tools/inline-tool-italic';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import Stub from '../tools/stub';
import { ModuleConfig } from '../../types-internal/module-config';
import EventsDispatcher from '../utils/events';

/**
 * @module Editor.js Tools Submodule
 *
 * Creates Instances from Plugins and binds external config to the instances
 */

/**
 * Class properties:
 *
 * @typedef {Tools} Tools
 * @property {Tools[]} toolsAvailable - available Tools
 * @property {Tools[]} toolsUnavailable - unavailable Tools
 * @property {object} toolsClasses - all classes
 * @property {object} toolsSettings - Tools settings
 * @property {EditorConfig} config - Editor config
 */
export default class Tools extends Module {
  /**
   * Name of Stub Tool
   * Stub Tool is used to substitute unavailable block Tools and store their data
   *
   * @type {string}
   */
  public stubTool = 'stub';

  /**
   * Returns available Tools
   *
   * @returns {object<Tool>}
   */
  public get available(): { [name: string]: ToolConstructable } {
    return this.toolsAvailable;
  }

  /**
   * Returns unavailable Tools
   *
   * @returns {Tool[]}
   */
  public get unavailable(): { [name: string]: ToolConstructable } {
    return this.toolsUnavailable;
  }

  /**
   * Return Tools for the Inline Toolbar
   *
   * @returns {object} - object of Inline Tool's classes
   */
  public get inline(): { [name: string]: InlineToolConstructable } {
    if (this._inlineTools) {
      return this._inlineTools;
    }

    const tools = Object.entries(this.available).filter(([name, tool]) => {
      if (!tool[this.INTERNAL_SETTINGS.IS_INLINE]) {
        return false;
      }

      /**
       * Some Tools validation
       */
      const inlineToolRequiredMethods = ['render', 'surround', 'checkState'];
      const notImplementedMethods = inlineToolRequiredMethods.filter((method) => !this.constructInline(tool, name)[method]);

      if (notImplementedMethods.length) {
        _.log(
          `Incorrect Inline Tool: ${tool.name}. Some of required methods is not implemented %o`,
          'warn',
          notImplementedMethods
        );

        return false;
      }

      return true;
    });

    /**
     * collected inline tools with key of tool name
     */
    const result = {};

    tools.forEach(([name, tool]) => {
      result[name] = tool;
    });

    /**
     * Cache prepared Tools
     */
    this._inlineTools = result;

    return this._inlineTools;
  }

  /**
   * Return editor block tools
   */
  public get blockTools(): { [name: string]: BlockToolConstructable } {
    const tools = Object.entries(this.available).filter(([, tool]) => {
      return !tool[this.INTERNAL_SETTINGS.IS_INLINE];
    });

    /**
     * collected block tools with key of tool name
     */
    const result = {};

    tools.forEach(([name, tool]) => {
      result[name] = tool;
    });

    return result;
  }

  /**
   * Constant for available Tools internal settings provided by Tool developer
   *
   * @returns {object}
   */
  public get INTERNAL_SETTINGS(): { [name: string]: string } {
    return {
      IS_ENABLED_LINE_BREAKS: 'enableLineBreaks',
      IS_INLINE: 'isInline',
      TITLE: 'title', // for Inline Tools. Block Tools can pass title along with icon through the 'toolbox' static prop.
      SHORTCUT: 'shortcut',
      TOOLBOX: 'toolbox',
      SANITIZE_CONFIG: 'sanitize',
      CONVERSION_CONFIG: 'conversionConfig',
      IS_READ_ONLY_SUPPORTED: 'isReadOnlySupported',
    };
  }

  /**
   * Constant for available Tools settings provided by user
   *
   * return {object}
   */
  public get USER_SETTINGS(): { [name: string]: string } {
    return {
      SHORTCUT: 'shortcut',
      TOOLBOX: 'toolbox',
      ENABLED_INLINE_TOOLS: 'inlineToolbar',
      CONFIG: 'config',
    };
  }

  /**
   * Map {name: Class, ...} where:
   *  name — block type name in JSON. Got from EditorConfig.tools keys
   *
   * @type {object}
   */
  public readonly toolsClasses: { [name: string]: ToolConstructable } = {};

  /**
   * Tools` classes available to use
   */
  private readonly toolsAvailable: { [name: string]: ToolConstructable } = {};

  /**
   * Tools` classes not available to use because of preparation failure
   */
  private readonly toolsUnavailable: { [name: string]: ToolConstructable } = {};

  /**
   * Tools settings in a map {name: settings, ...}
   *
   * @type {object}
   */
  private readonly toolsSettings: { [name: string]: ToolSettings } = {};

  /**
   * Cache for the prepared inline tools
   *
   * @type {null|object}
   * @private
   */
  private _inlineTools: { [name: string]: ToolConstructable } = {};

  /**
   * @class
   *
   * @param {EditorConfig} config - Editor's configuration
   * @param {EventsDispatcher} eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.toolsClasses = {};

    this.toolsSettings = {};

    /**
     * Available tools list
     * {name: Class, ...}
     *
     * @type {object}
     */
    this.toolsAvailable = {};

    /**
     * Tools that rejected a prepare method
     * {name: Class, ... }
     *
     * @type {object}
     */
    this.toolsUnavailable = {};

    this._inlineTools = null;
  }

  /**
   * Creates instances via passed or default configuration
   *
   * @returns {Promise<void>}
   */
  public prepare(): Promise<void> {
    this.validateTools();

    /**
     * Assign internal tools
     */
    this.config.tools = _.deepMerge({}, this.internalTools, this.config.tools);

    if (!Object.prototype.hasOwnProperty.call(this.config, 'tools') || Object.keys(this.config.tools).length === 0) {
      throw Error('Can\'t start without tools');
    }

    /**
     * Save Tools settings to a map
     */
    for (const toolName in this.config.tools) {
      /**
       * If Tool is an object not a Tool's class then
       * save class and settings separately
       */
      if (_.isObject(this.config.tools[toolName])) {
        /**
         * Save Tool's class from 'class' field
         *
         * @type {Tool}
         */
        this.toolsClasses[toolName] = (this.config.tools[toolName] as ToolSettings).class;

        /**
         * Save Tool's settings
         *
         * @type {ToolSettings}
         */
        this.toolsSettings[toolName] = this.config.tools[toolName] as ToolSettings;

        /**
         * Remove Tool's class from settings
         */
        delete this.toolsSettings[toolName].class;
      } else {
        /**
         * Save Tool's class
         *
         * @type {Tool}
         */
        this.toolsClasses[toolName] = this.config.tools[toolName] as ToolConstructable;

        /**
         * Set empty settings for Block by default
         *
         * @type {{}}
         */
        this.toolsSettings[toolName] = { class: this.config.tools[toolName] as ToolConstructable };
      }
    }

    /**
     * getting classes that has prepare method
     */
    const sequenceData = this.getListOfPrepareFunctions();

    /**
     * if sequence data contains nothing then resolve current chain and run other module prepare
     */
    if (sequenceData.length === 0) {
      return Promise.resolve();
    }

    /**
     * to see how it works {@link '../utils.ts#sequence'}
     */
    return _.sequence(sequenceData, (data: { toolName: string }) => {
      this.success(data);
    }, (data: { toolName: string }) => {
      this.fallback(data);
    });
  }

  /**
   * Success callback
   *
   * @param {object} data - append tool to available list
   */
  public success(data: { toolName: string }): void {
    this.toolsAvailable[data.toolName] = this.toolsClasses[data.toolName];
  }

  /**
   * Fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  public fallback(data: { toolName: string }): void {
    this.toolsUnavailable[data.toolName] = this.toolsClasses[data.toolName];
  }

  /**
   * Return Inline Tool's instance
   *
   * @param {InlineTool} tool - Inline Tool instance
   * @param {string} name - tool name
   * @param {ToolSettings} toolSettings - tool settings
   *
   * @returns {InlineTool} — instance
   */
  public constructInline(
    tool: InlineToolConstructable,
    name: string,
    toolSettings: ToolSettings = {} as ToolSettings
  ): InlineTool {
    const constructorOptions = {
      api: this.Editor.API.getMethodsForTool(name),
      config: (toolSettings[this.USER_SETTINGS.CONFIG] || {}) as ToolSettings,
    };

    // eslint-disable-next-line new-cap
    return new tool(constructorOptions) as InlineTool;
  }

  /**
   * Check if passed Tool is an instance of Default Block Tool
   *
   * @param {Tool} tool - Tool to check
   *
   * @returns {boolean}
   */
  public isDefault(tool): boolean {
    return tool instanceof this.available[this.config.defaultBlock];
  }

  /**
   * Return Tool's config by name
   *
   * @param {string} toolName - name of tool
   *
   * @returns {ToolSettings}
   */
  public getToolSettings(toolName): ToolSettings {
    const settings = this.toolsSettings[toolName];
    const config = settings[this.USER_SETTINGS.CONFIG] || {};

    // Pass placeholder to default Block config
    if (toolName === this.config.defaultBlock && !config.placeholder) {
      config.placeholder = this.config.placeholder;
      settings[this.USER_SETTINGS.CONFIG] = config;
    }

    return settings;
  }

  /**
   * Returns internal tools
   * Includes Bold, Italic, Link and Paragraph
   */
  public get internalTools(): { [toolName: string]: ToolConstructable | ToolSettings } {
    return {
      bold: { class: BoldInlineTool },
      italic: { class: ItalicInlineTool },
      link: { class: LinkInlineTool },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      stub: { class: Stub },
    };
  }

  /**
   * Returns true if tool supports read-only mode
   *
   * @param tool - tool to check
   */
  public isReadOnlySupported(tool: BlockToolConstructable): boolean {
    return tool[this.INTERNAL_SETTINGS.IS_READ_ONLY_SUPPORTED] === true;
  }

  /**
   * Calls each Tool reset method to clean up anything set by Tool
   */
  public destroy(): void {
    Object.values(this.available).forEach(async tool => {
      if (_.isFunction(tool.reset)) {
        await tool.reset();
      }
    });
  }

  /**
   * Binds prepare function of plugins with user or default config
   *
   * @returns {Array} list of functions that needs to be fired sequentially
   */
  private getListOfPrepareFunctions(): Array<{
    function: (data: { toolName: string; config: ToolConfig }) => void;
    data: { toolName: string; config: ToolConfig };
  }> {
    const toolPreparationList: Array<{
      function: (data: { toolName: string; config: ToolConfig }) => void;
      data: { toolName: string; config: ToolConfig };
    }
    > = [];

    for (const toolName in this.toolsClasses) {
      if (Object.prototype.hasOwnProperty.call(this.toolsClasses, toolName)) {
        const toolClass = this.toolsClasses[toolName];
        const toolConfig = this.toolsSettings[toolName][this.USER_SETTINGS.CONFIG];

        /**
         * If Tool hasn't a prepare method,
         * still push it to tool preparation list to save tools order in Toolbox.
         * As Tool's prepare method might be async, _.sequence util helps to save the order.
         */
        toolPreparationList.push({
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          function: _.isFunction(toolClass.prepare) ? toolClass.prepare : (): void => { },
          data: {
            toolName,
            config: toolConfig,
          },
        });
      }
    }

    return toolPreparationList;
  }

  /**
   * Validate Tools configuration objects and throw Error for user if it is invalid
   */
  private validateTools(): void {
    /**
     * Check Tools for a class containing
     */
    for (const toolName in this.config.tools) {
      if (Object.prototype.hasOwnProperty.call(this.config.tools, toolName)) {
        if (toolName in this.internalTools) {
          return;
        }

        const tool = this.config.tools[toolName];

        if (!_.isFunction(tool) && !_.isFunction((tool as ToolSettings).class)) {
          throw Error(
            `Tool «${toolName}» must be a constructor function or an object with function in the «class» property`
          );
        }
      }
    }
  }
}

/**
 * What kind of plugins developers can create
 */
export enum ToolType {
  /**
   * Block tool
   */
  Block,
  /**
   * Inline tool
   */
  Inline,

  /**
   * Block tune
   */
  Tune,
}
