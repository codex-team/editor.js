import { ToolType } from '../modules/tools';
import { Tool, ToolConstructable, ToolSettings } from '../../../types/tools';
import { API, SanitizerConfig } from '../../../types';

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

  constructor(name: string, Constructable: ToolConstructable, config: ToolConfig, api: API, defaultTool: string) {
    this.api = api;
    this.name = name;
    this.constructable = Constructable;
    this.config = config;
    this.defaultTool = defaultTool;
  }

  public get settings(): ToolConfig {
    const config = this.config[UserSettings.Config] || {};

    // TODO: Add default placeholder

    return config;
  }

  public reset(): void | Promise<void> {
    return this.constructable?.reset();
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
