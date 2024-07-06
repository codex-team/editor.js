import { ToolConstructable, ToolSettings } from '../../../types/tools';
import { InternalInlineToolSettings, InternalTuneSettings } from './base';
import InlineTool from './inline';
import BlockTune from './tune';
import BlockTool from './block';
import ApiModule from '../modules/api';
import { EditorConfig } from '../../../types/configs';

type ToolConstructor = typeof InlineTool | typeof BlockTool | typeof BlockTune;

/**
 * Factory to construct classes to work with tools
 */
export default class ToolsFactory {
  /**
   * Tools configuration specified by user
   */
  private config: {[name: string]: ToolSettings & { isInternal?: boolean }};

  /**
   * EditorJS API Module
   */
  private api: ApiModule;

  /**
   * EditorJS configuration
   */
  private editorConfig: EditorConfig;

  /**
   * @class
   * @param config - tools config
   * @param editorConfig - EditorJS config
   * @param api - EditorJS API module
   */
  constructor(
    config: {[name: string]: ToolSettings & { isInternal?: boolean }},
    editorConfig: EditorConfig,
    api: ApiModule
  ) {
    this.api = api;
    this.config = config;
    this.editorConfig = editorConfig;
  }

  /**
   * Returns Tool object based on it's type
   *
   * @param name - tool name
   */
  public get(name: string): InlineTool | BlockTool | BlockTune {
    const { class: constructable, isInternal = false, ...config } = this.config[name];

    const Constructor = this.getConstructor(constructable);
    const isTune = constructable[InternalTuneSettings.IsTune];

    return new Constructor({
      name,
      constructable,
      config,
      api: this.api.getMethodsForTool(name, isTune),
      isDefault: name === this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal,
    });
  }

  /**
   * Find appropriate Tool object constructor for Tool constructable
   *
   * @param constructable - Tools constructable
   */
  private getConstructor(constructable: ToolConstructable): ToolConstructor {
    switch (true) {
      case constructable[InternalInlineToolSettings.IsInline]:
        return InlineTool;
      case constructable[InternalTuneSettings.IsTune]:
        return BlockTune;
      default:
        return BlockTool;
    }
  }
}
