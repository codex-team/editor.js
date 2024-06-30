import { ToolConfig } from './tool-config';
import { ToolConstructable, BlockToolData, MenuConfig, MenuConfigItem } from './index';

/**
 * Tool may specify its toolbox configuration
 * It may include several entries as well
 */
export type ToolboxConfig = ToolboxConfigEntry | ToolboxConfigEntry[];

/**
 * Tool's Toolbox settings
 */
export interface ToolboxConfigEntry {
  /**
   * Tool title for Toolbox
   */
  title?: string;

  /**
   * HTML string with an icon for Toolbox
   */
  icon?: string;

  /**
   * May contain overrides for tool default config
   */
  data?: BlockToolData
}

/**
 * Object passed to the Tool's constructor by {@link EditorConfig#tools}
 *
 * @template Config - the structure describing a config object supported by the tool
 */
export interface ExternalToolSettings<Config extends object = any> {

  /**
   * Tool's class
   */
  class: ToolConstructable;

  /**
   * User configuration object that will be passed to the Tool's constructor
   */
  config?: ToolConfig<Config>;

  /**
   * Is need to show Inline Toolbar.
   * Can accept array of Tools for InlineToolbar or boolean.
   */
  inlineToolbar?: boolean | string[];

  /**
   * BlockTunes for Tool
   * Can accept array of tune names or boolean.
   */
  tunes?: boolean | string[];

  /**
   * Define shortcut that will render Tool
   */
  shortcut?: string;

  /**
   * Tool's Toolbox settings
   * It will be hidden from Toolbox when false is specified.
   */
  toolbox?: ToolboxConfig | false;
}

/**
 * Tool's tunes configuration.
 * @deprecated use {@link MenuConfig} type instead
 */
export type TunesMenuConfig = MenuConfig;

/**
 * Single Tunes Menu Config item
 * @deprecated use {@link MenuConfigItem} type instead
 */
export type TunesMenuConfigItem = MenuConfigItem;

/**
 * For internal Tools 'class' property is optional
 */
export type InternalToolSettings<Config extends object = any> = Omit<ExternalToolSettings<Config>, 'class'> & Partial<Pick<ExternalToolSettings<Config>, 'class'>>;

/**
 * Union of external and internal Tools settings
 */
export type ToolSettings<Config extends object = any> = InternalToolSettings<Config> | ExternalToolSettings<Config>;
