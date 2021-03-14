import BaseTool, { InternalSettings, UserSettings } from './base';
import { ToolType } from '../modules/tools';
import {
  BlockAPI,
  BlockTool as IBlockTool,
  ConversionConfig,
  PasteConfig,
  ToolboxConfig
} from '../../../types';
import * as _ from '../utils';

/**
 *
 */
export default class BlockTool extends BaseTool<IBlockTool> {
  public type = ToolType.Block;

  public instance(data: any, block: BlockAPI, readOnly: boolean): IBlockTool {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      data,
      block,
      readOnly,
      api: this.api,
      config: this.settings,
    }) as IBlockTool;
  }

  public get isReadOnlySupported(): boolean {
    return this.constructable[InternalSettings.IsReadOnlySupported] === true;
  }

  public get isLineBreaksEnabled(): boolean {
    return this.constructable[InternalSettings.IsEnabledLineBreaks];
  }

  public get toolbox(): ToolboxConfig {
    const toolToolboxSettings = this.constructable[InternalSettings.Toolbox] as ToolboxConfig;
    const userToolboxSettings = this.settings[UserSettings.Toolbox];

    if (_.isEmpty(toolToolboxSettings)) {
      return;
    }

    if ((userToolboxSettings ?? toolToolboxSettings) === false) {
      return;
    }

    return Object.assign({}, toolToolboxSettings, userToolboxSettings);
  }

  public get conversionConfig(): ConversionConfig {
    return this.constructable[InternalSettings.ConversionConfig];
  }

  public get enabledInlineTools(): boolean | string[] {
    return this.config[UserSettings.EnabledInlineTools];
  }

  public get pasteConfig(): PasteConfig {
    return this.constructable[InternalSettings.PasteConfig]
  }
}
