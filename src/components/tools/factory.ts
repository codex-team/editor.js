import type { ToolConstructable, ToolSettings } from '../../../types/tools';
import { InternalInlineToolSettings, InternalTuneSettings } from './base';
import InlineToolAdapter from './inline';
import BlockTuneAdapter from './tune';
import BlockToolAdapter from './block';
import type ApiModule from '../modules/api';
import type { EditorConfig } from '../../../types/configs';

type ToolConstructor = typeof InlineToolAdapter | typeof BlockToolAdapter | typeof BlockTuneAdapter;

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
  public get(name: string): InlineToolAdapter | BlockToolAdapter | BlockTuneAdapter {
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
        return InlineToolAdapter;
      case constructable[InternalTuneSettings.IsTune]:
        return BlockTuneAdapter;
      default:
        return BlockToolAdapter;
    }
  }
}
