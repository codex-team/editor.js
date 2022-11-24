import { Tool, ToolConstructable, ToolSettings } from '../../../types/tools';
import { SanitizerConfig } from '../../../types';
import * as _ from '../utils';
import type InlineTool from './inline';
import type BlockTool from './block';
import type BlockTune from './tune';
import API from '../modules/api';

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

/**
 * Enum of Tool options provided by user
 */
export enum UserSettings {
  /**
   * Shortcut for Tool
   */
  Shortcut = 'shortcut',
  /**
   * Toolbox config for Tool
   */
  Toolbox = 'toolbox',
  /**
   * Enabled Inline Tools for Block Tool
   */
  EnabledInlineTools = 'inlineToolbar',
  /**
   * Enabled Block Tunes for Block Tool
   */
  EnabledBlockTunes = 'tunes',
  /**
   * Tool configuration
   */
  Config = 'config',
}

/**
 * Enum of Tool options provided by Tool
 */
export enum CommonInternalSettings {
  /**
   * Shortcut for Tool
   */
  Shortcut = 'shortcut',
  /**
   * Sanitize configuration for Tool
   */
  SanitizeConfig = 'sanitize',

}

/**
 * Enum of Tool options provided by Block Tool
 */
export enum InternalBlockToolSettings {
  /**
   * Is line breaks enabled for Tool
   */
  IsEnabledLineBreaks = 'enableLineBreaks',
  /**
   * Tool Toolbox config
   */
  Toolbox = 'toolbox',
  /**
   * Tool conversion config
   */
  ConversionConfig = 'conversionConfig',
  /**
   * Is readonly mode supported for Tool
   */
  IsReadOnlySupported = 'isReadOnlySupported',
  /**
   * Tool paste config
   */
  PasteConfig = 'pasteConfig'
}

/**
 * Enum of Tool options provided by Inline Tool
 */
export enum InternalInlineToolSettings {
  /**
   * Flag specifies Tool is inline
   */
  IsInline = 'isInline',
  /**
   * Inline Tool title for toolbar
   */
  Title = 'title', // for Inline Tools. Block Tools can pass title along with icon through the 'toolbox' static prop.
}

/**
 * Enum of Tool options provided by Block Tune
 */
export enum InternalTuneSettings {
  /**
   * Flag specifies Tool is Block Tune
   */
  IsTune = 'isTune',
}

export type ToolOptions = Omit<ToolSettings, 'class'>;

interface ConstructorOptions {
  name: string;
  constructable: ToolConstructable;
  config: ToolOptions;
  api: API;
  isDefault: boolean;
  isInternal: boolean;
  defaultPlaceholder?: string | false;
}

/**
 * Base abstract class for Tools
 */
export default abstract class BaseTool<Type extends Tool = Tool> {
  /**
   * Tool type: Block, Inline or Tune
   */
  public type: ToolType;

  /**
   * Tool name specified in EditorJS config
   */
  public name: string;

  /**
   * Flag show is current Tool internal (bundled with EditorJS core) or not
   */
  public readonly isInternal: boolean;

  /**
   * Flag show is current Tool default or not
   */
  public readonly isDefault: boolean;

  /**
   * EditorJS API for current Tool
   */
  protected api: API;

  /**
   * Current tool user configuration
   */
  protected config: ToolOptions;

  /**
   * Tool's constructable blueprint
   */
  protected constructable: ToolConstructable;

  /**
   * Default placeholder specified in EditorJS user configuration
   */
  protected defaultPlaceholder?: string | false;

  /**
   * @class
   * @param {ConstructorOptions} options - Constructor options
   */
  constructor({
    name,
    constructable,
    config,
    api,
    isDefault,
    isInternal = false,
    defaultPlaceholder,
  }: ConstructorOptions) {
    this.api = api;
    this.name = name;
    this.constructable = constructable;
    this.config = config;
    this.isDefault = isDefault;
    this.isInternal = isInternal;
    this.defaultPlaceholder = defaultPlaceholder;
  }

  /**
   * Returns Tool user configuration
   */
  public get settings(): ToolOptions {
    const config = this.config[UserSettings.Config] || {};

    if (this.isDefault && !('placeholder' in config) && this.defaultPlaceholder) {
      config.placeholder = this.defaultPlaceholder;
    }

    return config;
  }

  /**
   * Calls Tool's reset method
   */
  public reset(): void | Promise<void> {
    if (_.isFunction(this.constructable.reset)) {
      return this.constructable.reset();
    }
  }

  /**
   * Calls Tool's prepare method
   */
  public prepare(): void | Promise<void> {
    if (_.isFunction(this.constructable.prepare)) {
      return this.constructable.prepare({
        toolName: this.name,
        config: this.settings,
      });
    }
  }

  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  public get shortcut(): string | undefined {
    const toolShortcut = this.constructable[CommonInternalSettings.Shortcut];
    const userShortcut = this.config[UserSettings.Shortcut];

    return userShortcut || toolShortcut;
  }

  /**
   * Returns Tool's sanitizer configuration
   */
  public get sanitizeConfig(): SanitizerConfig {
    return this.constructable[CommonInternalSettings.SanitizeConfig] || {};
  }

  /**
   * Returns true if Tools is inline
   */
  public isInline(): this is InlineTool {
    return this.type === ToolType.Inline;
  }

  /**
   * Returns true if Tools is block
   */
  public isBlock(): this is BlockTool {
    return this.type === ToolType.Block;
  }

  /**
   * Returns true if Tools is tune
   */
  public isTune(): this is BlockTune {
    return this.type === ToolType.Tune;
  }

  /**
   * Constructs new Tool instance from constructable blueprint
   *
   * @param args
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract create(...args: any[]): Type;
}
