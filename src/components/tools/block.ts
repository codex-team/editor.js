import BaseTool, { InternalBlockToolSettings, ToolType, UserSettings } from './base';
import {
  BlockAPI,
  BlockTool as IBlockTool,
  BlockToolConstructable,
  BlockToolData,
  ConversionConfig,
  PasteConfig, SanitizerConfig, ToolboxConfig,
  ToolboxConfigEntry
} from '../../../types';
import * as _ from '../utils';
import InlineTool from './inline';
import BlockTune from './tune';
import ToolsCollection from './collection';

/**
 * Class to work with Block tools constructables
 */
export default class BlockTool extends BaseTool<IBlockTool> {
  /**
   * Tool type — Block
   */
  public type = ToolType.Block;

  /**
   * InlineTool collection for current Block Tool
   */
  public inlineTools: ToolsCollection<InlineTool> = new ToolsCollection<InlineTool>();

  /**
   * BlockTune collection for current Block Tool
   */
  public tunes: ToolsCollection<BlockTune> = new ToolsCollection<BlockTune>();

  /**
   * Tool's constructable blueprint
   */
  protected constructable: BlockToolConstructable;

  /**
   * Creates new Tool instance
   *
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  public create(data: BlockToolData, block: BlockAPI, readOnly: boolean): IBlockTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      data,
      block,
      readOnly,
      api: this.api.getMethodsForTool(this),
      config: this.settings,
    }) as IBlockTool;
  }

  /**
   * Returns true if read-only mode is supported by Tool
   */
  public get isReadOnlySupported(): boolean {
    return this.constructable[InternalBlockToolSettings.IsReadOnlySupported] === true;
  }

  /**
   * Returns true if Tool supports linebreaks
   */
  public get isLineBreaksEnabled(): boolean {
    return this.constructable[InternalBlockToolSettings.IsEnabledLineBreaks];
  }

  /**
   * Returns Tool toolbox configuration (internal or user-specified).
   *
   * Merges internal and user-defined toolbox configs based on the following rules:
   *
   * - If both internal and user-defined toolbox configs are arrays their items are merged.
   * Length of the second one is kept.
   *
   * - If both are objects their properties are merged.
   *
   * - If one is an object and another is an array than internal config is replaced with user-defined
   * config. This is made to allow user to override default tool's toolbox representation (single/multiple entries)
   */
  public get toolbox(): ToolboxConfigEntry[] | undefined {
    const toolToolboxSettings = this.constructable[InternalBlockToolSettings.Toolbox] as ToolboxConfig;
    const userToolboxSettings = this.config[UserSettings.Toolbox];

    if (_.isEmpty(toolToolboxSettings)) {
      return;
    }
    if (userToolboxSettings === false) {
      return;
    }
    /**
     * Return tool's toolbox settings if user settings are not defined
     */
    if (!userToolboxSettings) {
      return Array.isArray(toolToolboxSettings) ? toolToolboxSettings : [ toolToolboxSettings ];
    }

    /**
     * Otherwise merge user settings with tool's settings
     */
    if (Array.isArray(toolToolboxSettings)) {
      if (Array.isArray(userToolboxSettings)) {
        return userToolboxSettings.map((item, i) => {
          const toolToolboxEntry = toolToolboxSettings[i];

          if (toolToolboxEntry) {
            return {
              ...toolToolboxEntry,
              ...item,
            };
          }

          return item;
        });
      }

      return [ userToolboxSettings ];
    } else {
      if (Array.isArray(userToolboxSettings)) {
        return userToolboxSettings;
      }

      return [
        {
          ...toolToolboxSettings,
          ...userToolboxSettings,
        },
      ];
    }
  }

  /**
   * Returns Tool conversion configuration
   */
  public get conversionConfig(): ConversionConfig | undefined {
    return this.constructable[InternalBlockToolSettings.ConversionConfig];
  }

  /**
   * Returns enabled inline tools for Tool
   */
  public get enabledInlineTools(): boolean | string[] {
    return this.config[UserSettings.EnabledInlineTools] || false;
  }

  /**
   * Returns enabled tunes for Tool
   */
  public get enabledBlockTunes(): boolean | string[] {
    return this.config[UserSettings.EnabledBlockTunes];
  }

  /**
   * Returns Tool paste configuration
   */
  public get pasteConfig(): PasteConfig {
    return this.constructable[InternalBlockToolSettings.PasteConfig] ?? {};
  }

  /**
   * Returns sanitize configuration for Block Tool including configs from related Inline Tools and Block Tunes
   */
  @_.cacheable
  public get sanitizeConfig(): SanitizerConfig {
    const toolRules = super.sanitizeConfig;
    const baseConfig = this.baseSanitizeConfig;

    if (_.isEmpty(toolRules)) {
      return baseConfig;
    }

    const toolConfig = {} as SanitizerConfig;

    for (const fieldName in toolRules) {
      if (Object.prototype.hasOwnProperty.call(toolRules, fieldName)) {
        const rule = toolRules[fieldName];

        /**
         * If rule is object, merge it with Inline Tools configuration
         *
         * Otherwise pass as it is
         */
        if (_.isObject(rule)) {
          toolConfig[fieldName] = Object.assign({}, baseConfig, rule);
        } else {
          toolConfig[fieldName] = rule;
        }
      }
    }

    return toolConfig;
  }

  /**
   * Returns sanitizer configuration composed from sanitize config of Inline Tools enabled for Tool
   */
  @_.cacheable
  public get baseSanitizeConfig(): SanitizerConfig {
    const baseConfig = {};

    Array
      .from(this.inlineTools.values())
      .forEach(tool => Object.assign(baseConfig, tool.sanitizeConfig));

    Array
      .from(this.tunes.values())
      .forEach(tune => Object.assign(baseConfig, tune.sanitizeConfig));

    return baseConfig;
  }
}
