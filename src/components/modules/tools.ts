import Paragraph from '../../tools/paragraph/dist/bundle';
import Module from '../__module';
import * as _ from '../utils';
import {
  BlockToolConstructable,
  EditorConfig,
  InlineTool as IInlineTool,
  InlineToolConstructable,
  Tool,
  ToolConfig,
  ToolConstructable,
  ToolSettings
} from '../../../types';
import BoldInlineTool from '../inline-tools/inline-tool-bold';
import ItalicInlineTool from '../inline-tools/inline-tool-italic';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import Stub from '../../tools/stub';
import ToolsFactory from '../tools/factory';
import InlineTool from '../tools/inline';
import BlockTool from '../tools/block';
import BlockTune from '../tools/tune';
import {debug} from "webpack";
import {UserSettings} from "../tools/base";

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
  public get available(): { [name: string]: InlineTool | BlockTool | BlockTune } {
    return this.toolsAvailable;
  }

  /**
   * Returns unavailable Tools
   *
   * @returns {Tool[]}
   */
  public get unavailable(): { [name: string]: InlineTool | BlockTool | BlockTune } {
    return this.toolsUnavailable;
  }

  /**
   * Return Tools for the Inline Toolbar
   *
   * @returns {object} - object of Inline Tool's classes
   */
  public get inline(): { [name: string]: InlineTool } {
    if (this._inlineTools) {
      return this._inlineTools;
    }

    const tools = Object.entries(this.available).filter(([name, tool]: [string, InlineTool]) => {
      if (tool.type !== ToolType.Inline) {
        return false;
      }

      /**
       * Some Tools validation
       */
      const inlineToolRequiredMethods = ['render', 'surround', 'checkState'];
      const notImplementedMethods = inlineToolRequiredMethods.filter((method) => !tool.instance()[method]);

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
  public get blockTools(): { [name: string]: BlockTool } {
    const tools = Object.entries(this.available).filter(([, tool]) => {
      return tool.type === ToolType.Block;
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
   * Map {name: Class, ...} where:
   *  name — block type name in JSON. Got from EditorConfig.tools keys
   *
   * @type {object}
   */
  public readonly toolsClasses: { [name: string]: ToolConstructable } = {};


  private factory: ToolsFactory;

  /**
   * Tools` classes available to use
   */
  private readonly toolsAvailable: { [name: string]: InlineTool | BlockTool | BlockTune } = {};

  /**
   * Tools` classes not available to use because of preparation failure
   */
  private readonly toolsUnavailable: { [name: string]: InlineTool | BlockTool | BlockTune } = {};

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
  private _inlineTools: { [name: string]: InlineTool } = {};

  /**
   * @class
   *
   * @param {EditorConfig} config - Editor's configuration
   */
  constructor({ config }) {
    super({ config });

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

    const config = this.prepareConfig();

    this.factory = new ToolsFactory(config, this.config.defaultBlock, this.Editor.API);

    /**
     * Save Tools settings to a map
     */
    for (const toolName in config) {
      if (!Object.prototype.hasOwnProperty.call(config, toolName)) {
        continue;
      }

      /**
       * Save Tool's class from 'class' field
       *
       * @type {Tool}
       */
      this.toolsClasses[toolName] = (config[toolName] as ToolSettings).class;

      /**
       * Save Tool's settings
       *
       * @type {ToolSettings}
       */
      this.toolsSettings[toolName] = config[toolName] as ToolSettings;

      // /**
      //  * Remove Tool's class from settings
      //  */
      // delete this.toolsSettings[toolName].class;
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
    this.toolsAvailable[data.toolName] = this.factory.get(data.toolName);
  }

  /**
   * Fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  public fallback(data: { toolName: string }): void {
    this.toolsUnavailable[data.toolName] = this.factory.get(data.toolName);
  }

  /**
   * TODO: replace with factory
   *
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
  private getListOfPrepareFunctions(): {
    function: (data: { toolName: string; config: ToolConfig }) => void;
    data: { toolName: string; config: ToolConfig };
  }[] {
    const toolPreparationList: {
      function: (data: { toolName: string; config: ToolConfig }) => void;
      data: { toolName: string; config: ToolConfig };
    }[] = [];

    for (const toolName in this.toolsClasses) {
      if (Object.prototype.hasOwnProperty.call(this.toolsClasses, toolName)) {
        const toolClass = this.toolsClasses[toolName];
        const toolConfig = this.toolsSettings[toolName][UserSettings.Config];

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

  private prepareConfig(): {[name: string]: ToolSettings} {
    const config: {[name: string]: ToolSettings} = {};

    /**
     * Save Tools settings to a map
     */
    for (const toolName in this.config.tools) {
      /**
       * If Tool is an object not a Tool's class then
       * save class and settings separately
       */
      if (_.isObject(this.config.tools[toolName])) {
        config[toolName] = this.config.tools[toolName] as ToolSettings;
      } else {
        config[toolName] = { class: this.config.tools[toolName] as ToolConstructable };
      }
    }

    return config;
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
