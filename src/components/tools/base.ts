import { ToolType } from '../modules/tools';
import { Tool, ToolConstructable, ToolSettings } from '../../../types/tools';
import {API, SanitizerConfig} from '../../../types';
import * as _ from '../utils'

export enum UserSettings {
  Shortcut = 'shortcut',
  Toolbox = 'toolbox',
  EnabledInlineTools = 'inlineToolbar',
  Config = 'config',
}

export enum InternalSettings {
  IsEnabledLineBreaks = 'enableLineBreaks',
  IsInline = 'isInline',
  IsTune = 'isTune',
  Title = 'title', // for Inline Tools. Block Tools can pass title along with icon through the 'toolbox' static prop.
  Shortcut = 'shortcut',
  Toolbox = 'toolbox',
  SanitizeConfig = 'sanitize',
  ConversionConfig = 'conversionConfig',
  IsReadOnlySupported = 'isReadOnlySupported',
  PasteConfig = 'pasteConfig'
}

export type ToolConfig = Omit<ToolSettings, 'class'>

interface ConstructorOptions {
  name: string;
  constructable: ToolConstructable;
  config: ToolConfig;
  api: API;
  defaultTool: string;
  isInternal: boolean;
  defaultPlaceholder?: string | false
}

/**
 * Base abstract class for Tools
 */
export default abstract class BaseTool<Type extends Tool> {
  /**
   * Tool type: Block, Inline or Tune
   */
  public type: ToolType;

  /**
   * Tool name specified in EditorJS config
   */
  public name: string;

  /**
   * EditorJS API for current Tool
   */
  protected api: API;

  /**
   * Current tool user configuration
   */
  protected config: ToolConfig;

  /**
   * Tool's constructable blueprint
   */
  protected constructable: ToolConstructable;

  /**
   * Editor default tool
   */
  protected defaultTool: string;

  /**
   * Flag show is current Tool internal or not
   */
  public readonly isInternal: boolean;

  /**
   * Default placeholder specified in EditorJS user configuration
   */
  protected defaultPlaceholder?: string | false;

  constructor({
    name,
    constructable,
    config,
    api,
    defaultTool,
    isInternal = false,
    defaultPlaceholder
  }: ConstructorOptions) {
    this.api = api;
    this.name = name;
    this.constructable = constructable;
    this.config = config;
    this.defaultTool = defaultTool;
    this.isInternal = isInternal;
    this.defaultPlaceholder = defaultPlaceholder;
  }

  /**
   * Returns Tool user configuration
   */
  public get settings(): ToolConfig {
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
        config: this.settings
      });
    }
  }

  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  public get shortcut(): string | undefined {
    const toolShortcut = this.constructable[InternalSettings.Shortcut];
    const userShortcut = this.settings[UserSettings.Shortcut];

    return userShortcut || toolShortcut;
  }

  /**
   * Returns Tool's sanitizer configuration
   */
  public get sanitizeConfig(): SanitizerConfig {
    return this.constructable[InternalSettings.SanitizeConfig];
  }

  /**
   * Returns true if current Tool is default
   */
  public get isDefault(): boolean {
    return this.name === this.defaultTool;
  }

  /**
   * Constructs new Tool instance from constructable blueprint
   * @param args
   */
  public abstract instance(...args: any[]): Type;
}
