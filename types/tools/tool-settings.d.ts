import {ToolConfig} from './tool-config';
import {ToolConstructable} from './index';

/**
 * Tool's Toolbox settings
 */
export interface ToolboxConfig {
  /**
   * Tool title for Toolbox
   */
  title?: string;

  /**
   * HTML string with an icon for Toolbox
   */
  icon?: string;
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
 * For internal Tools 'class' property is optional
 */
export type InternalToolSettings<Config extends object = any> = Omit<ExternalToolSettings<Config>, 'class'> & Partial<Pick<ExternalToolSettings<Config>, 'class'>>;

/**
 * Union of external and internal Tools settings
 */
export type ToolSettings<Config extends object = any> = InternalToolSettings<Config> | ExternalToolSettings<Config>;
