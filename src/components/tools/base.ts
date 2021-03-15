import { ToolType } from '../modules/tools';
import { Tool, ToolConstructable, ToolSettings } from '../../../types/tools';
import {API, EditorConfig, SanitizerConfig} from '../../../types';

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
 *
 */
export default abstract class BaseTool<Type extends Tool> {
  public type: ToolType;

  public name: string;

  protected api: API;

  protected config: ToolConfig;

  protected constructable: ToolConstructable;
  protected defaultTool: string;
  public readonly isInternal: boolean;
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

  public get settings(): ToolConfig {
    const config = this.config[UserSettings.Config] || {};

    if (this.isDefault && !('placeholder' in config) && this.defaultPlaceholder) {
      config.placeholder = this.defaultPlaceholder;
    }

    return config;
  }

  public reset(): void | Promise<void> {
    return this.constructable?.reset();
  }

  public prepare(): void | Promise<void> {
    return this.constructable?.prepare({
      toolName: this.name,
      config: this.settings
    });
  }

  public get shortcut(): string | undefined {
    const toolShortcut = this.constructable[InternalSettings.Shortcut];
    const userShortcut = this.settings[UserSettings.Shortcut];

    return userShortcut || toolShortcut;
  }

  public get sanitizeConfig(): SanitizerConfig {
    return this.constructable[InternalSettings.SanitizeConfig];
  }

  public get isDefault(): boolean {
    return this.name === this.defaultTool;
  }

  public abstract instance(...args: any[]): Type;
}
