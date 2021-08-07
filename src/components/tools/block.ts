import BaseTool, { InternalBlockToolSettings, ToolType, UserSettings } from './base';
import {
  BlockAPI,
  BlockTool as IBlockTool,
  BlockToolConstructable,
  BlockToolData,
  ConversionConfig,
  PasteConfig, SanitizerConfig,
  ToolboxConfig
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
   * Returns Tool toolbox configuration (internal or user-specified)
   */
  public get toolbox(): ToolboxConfig {
    const toolToolboxSettings = this.constructable[InternalBlockToolSettings.Toolbox] as ToolboxConfig;
    const userToolboxSettings = this.config[UserSettings.Toolbox];

    if (_.isEmpty(toolToolboxSettings)) {
      return;
    }

    if ((userToolboxSettings ?? toolToolboxSettings) === false) {
      return;
    }

    return Object.assign({}, toolToolboxSettings, userToolboxSettings);
  }

  /**
   * Returns Tool conversion configuration
   */
  public get conversionConfig(): ConversionConfig {
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
    return this.constructable[InternalBlockToolSettings.PasteConfig] || {};
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
