import { ToolConstructable, ToolSettings } from '../../../types/tools';
import { InternalSettings } from './base';
import InlineTool from './inline';
import BlockTune from './tune';
import BlockTool from './block';
import API from '../modules/api';
import { ToolType } from '../modules/tools';

type ToolConstructor = typeof InlineTool | typeof BlockTool | typeof BlockTune;

/**
 *
 */
export default class ToolsFactory {
  private config: {[name: string]: ToolSettings};
  private api: API;
  private defaultTool: string;

  constructor(config: {[name: string]: ToolSettings}, defaultTool: string, api: API) {
    this.api = api;
    this.config = config;
    this.defaultTool = defaultTool;
  }

  public get(name: string): InlineTool | BlockTool | BlockTune {
    const { class: constructable, ...config } = this.config[name];

    const [Constructor, type] = this.getConstructor(constructable);

    return new Constructor(name, constructable, config, this.api.getMethodsForTool(name, type), this.defaultTool);
  }

  private getConstructor(constructable: ToolConstructable): [ToolConstructor, ToolType] {
    switch (true) {
      case constructable[InternalSettings.IsInline]:
        return [InlineTool, ToolType.Inline];
      case constructable[InternalSettings.IsTune]:
        return [BlockTune, ToolType.Tune];
      default:
        return [BlockTool, ToolType.Block];
    }
  }
}
