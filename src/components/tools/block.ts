import BaseTool, { InternalBlockToolSettings, UserSettings } from './base';
import { ToolType } from '../modules/tools';
import {
  BlockAPI,
  BlockTool as IBlockTool,
  BlockToolData,
  ConversionConfig,
  PasteConfig,
  ToolboxConfig
} from '../../../types';
import * as _ from '../utils';

/**
 * Class to work with Block tools constructables
 */
export default class BlockTool extends BaseTool<IBlockTool> {
  /**
   * Tool type — Block
   */
  public type = ToolType.Block;

  /**
   * Creates new Tool instance
   *
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  public instance(data: BlockToolData, block: BlockAPI, readOnly: boolean): IBlockTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      data,
      block,
      readOnly,
      api: this.api,
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
    const userToolboxSettings = this.settings[UserSettings.Toolbox];

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
    return this.config[UserSettings.EnabledInlineTools];
  }

  /**
   * Returns Tool paste configuration
   */
  public get pasteConfig(): PasteConfig {
    return this.constructable[InternalBlockToolSettings.PasteConfig] || {};
  }
}
