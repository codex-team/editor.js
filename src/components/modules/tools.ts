import Paragraph from '@editorjs/paragraph';
import Module from '../__module';
import * as _ from '../utils';
import type { ChainData } from '../utils';
import PromiseQueue from '../utils/promise-queue';
import type { SanitizerConfig, ToolConfig, ToolConstructable, ToolSettings } from '../../../types';
import BoldInlineTool from '../inline-tools/inline-tool-bold';
import ItalicInlineTool from '../inline-tools/inline-tool-italic';
import LinkInlineTool from '../inline-tools/inline-tool-link';
import ConvertInlineTool from '../inline-tools/inline-tool-convert';
import Stub from '../../tools/stub';
import ToolsFactory from '../tools/factory';
import type InlineToolAdapter from '../tools/inline';
import type BlockToolAdapter from '../tools/block';
import type BlockTuneAdapter from '../tools/tune';
import MoveDownTune from '../block-tunes/block-tune-move-down';
import DeleteTune from '../block-tunes/block-tune-delete';
import MoveUpTune from '../block-tunes/block-tune-move-up';
import ToolsCollection from '../tools/collection';

const cacheableSanitizer = _.cacheable as (
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<() => SanitizerConfig>
) => void;

type ToolPrepareData = {
  toolName: string;
  config: ToolConfig;
};

const toToolConstructable = (constructable: unknown): ToolConstructable => {
  if (!_.isFunction(constructable)) {
    throw new Error('Tool constructable must be a function');
  }

  return constructable as unknown as ToolConstructable;
};

/**
 * @module Editor.js Tools Submodule
 *
 * Creates Instances from Plugins and binds external config to the instances
 */

/**
 * Modules that works with tools classes
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
   */
  public get available(): ToolsCollection {
    return this.toolsAvailable;
  }

  /**
   * Returns unavailable Tools
   */
  public get unavailable(): ToolsCollection {
    return this.toolsUnavailable;
  }

  /**
   * Return Tools for the Inline Toolbar
   */
  public get inlineTools(): ToolsCollection<InlineToolAdapter> {
    return this.available.inlineTools;
  }

  /**
   * Return editor block tools
   */
  public get blockTools(): ToolsCollection<BlockToolAdapter> {
    return this.available.blockTools;
  }

  /**
   * Return available Block Tunes
   *
   * @returns {object} - object of Inline Tool's classes
   */
  public get blockTunes(): ToolsCollection<BlockTuneAdapter> {
    return this.available.blockTunes;
  }

  /**
   * Returns default Tool object
   */
  public get defaultTool(): BlockToolAdapter {
    const defaultBlockName = this.config.defaultBlock;

    if (!defaultBlockName) {
      throw new Error('Default block tool name is not configured');
    }

    const tool = this.blockTools.get(defaultBlockName);

    if (!tool) {
      throw new Error(`Default block tool "${defaultBlockName}" not found in available block tools`);
    }

    return tool;
  }

  /**
   * Tools objects factory
   */
  private factory: ToolsFactory | null = null;

  /**
   * Tools` classes available to use
   */
  private readonly toolsAvailable: ToolsCollection = new ToolsCollection();

  /**
   * Tools` classes not available to use because of preparation failure
   */
  private readonly toolsUnavailable: ToolsCollection = new ToolsCollection();

  /**
   * Returns internal tools
   */
  public get internal(): ToolsCollection {
    return this.available.internalTools;
  }

  /**
   * Creates instances via passed or default configuration
   *
   * @returns {Promise<void>}
   */
  public async prepare(): Promise<void> {
    this.validateTools();

    /**
     * Assign internal tools
     */
    const userTools = this.config.tools ?? {};

    this.config.tools = _.deepMerge({}, this.internalTools, userTools);

    const toolsConfig = this.config.tools;

    if (!toolsConfig || Object.keys(toolsConfig).length === 0) {
      throw Error('Can\'t start without tools');
    }

    const config = this.prepareConfig(toolsConfig);

    this.factory = new ToolsFactory(config, this.config, this.Editor.API);

    /**
     * getting classes that has prepare method
     */
    const sequenceData = this.getListOfPrepareFunctions(config);

    /**
     * if sequence data contains nothing then resolve current chain and run other module prepare
     */
    if (sequenceData.length === 0) {
      return Promise.resolve();
    }

    /* to see how it works {@link '../utils.ts#sequence'} */
    const handlePrepareSuccess = (data: object): void => {
      if (!this.isToolPrepareData(data)) {
        return;
      }

      this.toolPrepareMethodSuccess({ toolName: data.toolName });
    };

    const handlePrepareFallback = (data: object): void => {
      if (!this.isToolPrepareData(data)) {
        return;
      }

      this.toolPrepareMethodFallback({ toolName: data.toolName });
    };

    const queue = new PromiseQueue();

    sequenceData.forEach(chainData => {
      void queue.add(async () => {
        const callbackData = !_.isUndefined(chainData.data) ? chainData.data : {};

        try {
          await chainData.function(chainData.data);
          handlePrepareSuccess(callbackData);
        } catch (error) {
          handlePrepareFallback(callbackData);
        }
      });
    });

    await queue.completed;

    this.prepareBlockTools();
  }

  /**
   * Return general Sanitizer config for all inline tools
   */
  @cacheableSanitizer
  public getAllInlineToolsSanitizeConfig(): SanitizerConfig {
    const config: SanitizerConfig = {} as SanitizerConfig;

    Array.from(this.inlineTools.values())
      .forEach(inlineTool => {
        Object.assign(config, inlineTool.sanitizeConfig);
      });

    return config;
  }

  /**
   * Calls each Tool reset method to clean up anything set by Tool
   */
  public destroy(): void {
    for (const tool of this.available.values()) {
      const resetResult = (() => {
        try {
          return tool.reset();
        } catch (error) {
          _.log(`Tool "${tool.name}" reset failed`, 'warn', error);

          return undefined;
        }
      })();

      if (resetResult instanceof Promise) {
        resetResult.catch(error => {
          _.log(`Tool "${tool.name}" reset failed`, 'warn', error);
        });
      }
    }
  }

  /**
   * Returns internal tools
   * Includes Bold, Italic, Link and Paragraph
   */
  private get internalTools(): { [toolName: string]: ToolConstructable | ToolSettings & { isInternal?: boolean } } {
    return {
      convertTo: {
        class: toToolConstructable(ConvertInlineTool),
        isInternal: true,
      },
      link: {
        class: toToolConstructable(LinkInlineTool),
        isInternal: true,
      },
      bold: {
        class: toToolConstructable(BoldInlineTool),
        isInternal: true,
      },
      italic: {
        class: toToolConstructable(ItalicInlineTool),
        isInternal: true,
      },
      paragraph: {
        class: toToolConstructable(Paragraph),
        inlineToolbar: true,
        isInternal: true,
      },
      stub: {
        class: toToolConstructable(Stub),
        isInternal: true,
      },
      moveUp: {
        class: toToolConstructable(MoveUpTune),
        isInternal: true,
      },
      delete: {
        class: toToolConstructable(DeleteTune),
        isInternal: true,
      },
      moveDown: {
        class: toToolConstructable(MoveDownTune),
        isInternal: true,
      },
    };
  }

  /**
   * Tool prepare method success callback
   *
   * @param {object} data - append tool to available list
   */
  private toolPrepareMethodSuccess(data: { toolName: string }): void {
    const tool = this.getFactory().get(data.toolName);

    if (!tool.isInline()) {
      this.toolsAvailable.set(tool.name, tool);

      return;
    }

    /**
     * Some Tools validation
     */
    const inlineToolRequiredMethods = [ 'render' ];
    const notImplementedMethods = tool.getMissingMethods(inlineToolRequiredMethods);

    if (notImplementedMethods.length) {
      _.log(
        `Incorrect Inline Tool: ${tool.name}. Some of required methods is not implemented %o`,
        'warn',
        notImplementedMethods
      );

      this.toolsUnavailable.set(tool.name, tool);

      return;
    }

    this.toolsAvailable.set(tool.name, tool);
  }

  /**
   * Tool prepare method fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  private toolPrepareMethodFallback(data: { toolName: string }): void {
    const factory = this.getFactory();

    this.toolsUnavailable.set(data.toolName, factory.get(data.toolName));
  }

  /**
   * Binds prepare function of plugins with user or default config
   *
   * @returns {Array} list of functions that needs to be fired sequentially
   * @param config - tools config
   */
  private getListOfPrepareFunctions(config: Record<string, ToolSettings>): ChainData[] {
    return Object
      .entries(config)
      .map(([toolName, settings]): ChainData => {
        const toolData: ToolPrepareData = {
          toolName,
          config: (settings.config ?? {}) as ToolConfig,
        };

        const prepareFunction: ChainData['function'] = async (payload?: unknown) => {
          const constructable = settings.class;

          if (!constructable || !_.isFunction(constructable.prepare)) {
            return;
          }

          const data = (payload ?? toolData) as ToolPrepareData;
          const prepareMethod = constructable.prepare as unknown as (
            this: typeof constructable,
            payload: ToolPrepareData
          ) => void | Promise<void>;

          return prepareMethod.call(constructable, data);
        };

        return {
          function: prepareFunction,
          data: toolData,
        };
      });
  }

  /**
   * Assign enabled Inline Tools and Block Tunes for Block Tool
   */
  private prepareBlockTools(): void {
    Array.from(this.blockTools.values()).forEach(tool => {
      this.assignInlineToolsToBlockTool(tool);
      this.assignBlockTunesToBlockTool(tool);
    });
  }

  /**
   * Assign enabled Inline Tools for Block Tool
   *
   * @param tool - Block Tool
   */
  private assignInlineToolsToBlockTool(tool: BlockToolAdapter): void {
    const blockTool = tool;

    /**
     * If common inlineToolbar property is false no Inline Tools should be assigned
     */
    if (this.config.inlineToolbar === false) {
      return;
    }

    /**
     * If user pass just 'true' for tool, get common inlineToolbar settings
     * - if common settings is an array, use it
     * - if common settings is 'true' or not specified, get default order
     */
    if (blockTool.enabledInlineTools === true) {
      const inlineTools = Array.isArray(this.config.inlineToolbar)
        ? this.createInlineToolsCollection(this.config.inlineToolbar)
        /**
         * If common settings is 'true' or not specified (will be set as true at core.ts), get the default order
         */
        : new ToolsCollection<InlineToolAdapter>(Array.from(this.inlineTools.entries()));

      blockTool.inlineTools = inlineTools;

      return;
    }

    /**
     * If user pass the list of inline tools for the particular tool, return it.
     */
    if (Array.isArray(blockTool.enabledInlineTools)) {
      /** Prepend ConvertTo Inline Tool */
      const inlineTools = this.createInlineToolsCollection(['convertTo', ...blockTool.enabledInlineTools]);

      blockTool.inlineTools = inlineTools;
    }
  }

  /**
   * Assign enabled Block Tunes for Block Tool
   *
   * @param tool — Block Tool
   */
  private assignBlockTunesToBlockTool(tool: BlockToolAdapter): void {
    const blockTool = tool;

    if (blockTool.enabledBlockTunes === false) {
      return;
    }

    if (Array.isArray(blockTool.enabledBlockTunes)) {
      const userTunes = this.createBlockTunesCollection(blockTool.enabledBlockTunes);
      const combinedEntries = [
        ...Array.from(userTunes.entries()),
        ...Array.from(this.blockTunes.internalTools.entries()),
      ];

      blockTool.tunes = new ToolsCollection<BlockTuneAdapter>(combinedEntries);

      return;
    }

    if (Array.isArray(this.config.tunes)) {
      const userTunes = this.createBlockTunesCollection(this.config.tunes);
      const combinedEntries = [
        ...Array.from(userTunes.entries()),
        ...Array.from(this.blockTunes.internalTools.entries()),
      ];

      blockTool.tunes = new ToolsCollection<BlockTuneAdapter>(combinedEntries);

      return;
    }

    blockTool.tunes = new ToolsCollection<BlockTuneAdapter>(
      Array.from(this.blockTunes.internalTools.entries())
    );
  }

  /**
   * Validate Tools configuration objects and throw Error for user if it is invalid
   */
  private validateTools(): void {
    const toolsConfig = this.config.tools;

    if (!toolsConfig) {
      return;
    }

    const internalTools = this.internalTools;

    /**
     * Check Tools for a class containing
     */
    for (const toolName in toolsConfig) {
      if (!Object.prototype.hasOwnProperty.call(toolsConfig, toolName)) {
        continue;
      }

      if (toolName in internalTools) {
        continue;
      }

      const tool = toolsConfig[toolName];
      const isConstructorFunction = _.isFunction(tool);
      const toolSettings = tool as ToolSettings;
      const hasToolClass = _.isFunction(toolSettings.class);

      if (!isConstructorFunction && !hasToolClass) {
        throw Error(
          `Tool «${toolName}» must be a constructor function or an object with function in the «class» property`
        );
      }
    }
  }

  /**
   * Unify tools config
   *
   * @param toolsConfig - raw tools configuration
   */
  private prepareConfig(toolsConfig: Record<string, ToolConstructable | ToolSettings>): Record<string, ToolSettings> {
    const config: Record<string, ToolSettings> = {};

    /**
     * Save Tools settings to a map
     */
    for (const toolName in toolsConfig) {
      /**
       * If Tool is an object not a Tool's class then
       * save class and settings separately
       */
      if (!Object.prototype.hasOwnProperty.call(toolsConfig, toolName)) {
        continue;
      }

      const tool = toolsConfig[toolName];

      if (_.isObject(tool)) {
        config[toolName] = tool as ToolSettings;

        continue;
      }

      config[toolName] = { class: tool as ToolConstructable };
    }

    return config;
  }

  /**
   * Type guard that ensures provided data contains tool preparation metadata.
   *
   * @param data - data passed to prepare sequence callbacks
   */
  private isToolPrepareData(data: object): data is ToolPrepareData {
    const candidate = data as Partial<ToolPrepareData>;

    return typeof candidate?.toolName === 'string';
  }

  /**
   * Returns initialized tools factory instance.
   *
   * @returns tools factory
   */
  private getFactory(): ToolsFactory {
    if (this.factory === null) {
      throw new Error('Tools factory is not initialized');
    }

    return this.factory;
  }

  /**
   * Builds inline tools collection for provided tool names, skipping unavailable ones.
   *
   * @param toolNames - inline tool names to include
   * @returns tools collection containing available inline tools
   */
  private createInlineToolsCollection(toolNames: Iterable<string>): ToolsCollection<InlineToolAdapter> {
    const entries: [string, InlineToolAdapter][] = [];

    for (const name of toolNames) {
      const inlineTool = this.inlineTools.get(name);

      if (!inlineTool) {
        _.log(`Inline tool "${name}" is not available and will be skipped`, 'warn');
        continue;
      }

      entries.push([name, inlineTool]);
    }

    return new ToolsCollection<InlineToolAdapter>(entries);
  }

  /**
   * Builds block tunes collection for provided tune names, skipping unavailable ones.
   *
   * @param tuneNames - block tune names to include
   * @returns tools collection containing available block tunes
   */
  private createBlockTunesCollection(tuneNames: Iterable<string>): ToolsCollection<BlockTuneAdapter> {
    const entries: [string, BlockTuneAdapter][] = [];

    for (const name of tuneNames) {
      const tune = this.blockTunes.get(name);

      if (!tune) {
        _.log(`Block tune "${name}" is not available and will be skipped`, 'warn');
        continue;
      }

      entries.push([name, tune]);
    }

    return new ToolsCollection<BlockTuneAdapter>(entries);
  }
}
