import { ToolConstructable, ToolSettings } from '../../../types/tools';
import { InternalSettings } from './base';
import InlineTool from './inline';
import BlockTune from './tune';
import BlockTool from './block';
import API from '../modules/api';
import { ToolType } from '../modules/tools';
import {EditorConfig} from '../../../types/configs';

type ToolConstructor = typeof InlineTool | typeof BlockTool | typeof BlockTune;

/**
 *
 */
export default class ToolsFactory {
  private config: {[name: string]: ToolSettings & { isInternal?: boolean }};
  private api: API;
  private editorConfig: EditorConfig;

  constructor(
    config: {[name: string]: ToolSettings & { isInternal?: boolean }},
    editorConfig: EditorConfig,
    api: API
  ) {
    this.api = api;
    this.config = config;
    this.editorConfig = editorConfig;
  }

  public get(name: string): InlineTool | BlockTool | BlockTune {
    const { class: constructable, isInternal = false, ...config } = this.config[name];

    const [Constructor, type] = this.getConstructor(constructable);

    return new Constructor({
      name,
      constructable,
      config,
      api: this.api.getMethodsForTool(name, type),
      defaultTool: this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal
    });
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
