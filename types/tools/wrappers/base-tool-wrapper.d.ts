import { Tool, ToolConstructable, ToolSettings } from '..';
import type { SanitizerConfig, API as ApiMethods } from '../..';

import { ToolType } from './tool-type';
import { InlineToolWrapper } from './inline-tool-wrapper';
import { BlockToolWrapper } from './block-tool-wrapper';
import { BlockTuneWrapper } from './block-tune-wrapper';

export interface BaseToolWrapper<Type extends ToolType, ToolClass extends Tool> {
  /**
   * Tool type: Block, Inline or Tune
   */
  type: Type;

  /**
   * Tool name specified in EditorJS config
   */
  name: string;

  /**
   * Flag show is current Tool internal (bundled with EditorJS core) or not
   */
  readonly isInternal: boolean;

  /**
   * Flag show is current Tool default or not
   */
  readonly isDefault: boolean;

  /**
   * Returns Tool user configuration
   */
  settings: ToolSettings;

  /**
   * Calls Tool's reset method
   */
  reset(): void | Promise<void>;

  /**
   * Calls Tool's prepare method
   */
  prepare(): void | Promise<void>;

  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  shortcut: string | undefined;

  /**
   * Returns Tool's sanitizer configuration
   */
  sanitizeConfig: SanitizerConfig;

  /**
   * Returns true if Tools is inline
   */
  isInline(): this is InlineToolWrapper;

  /**
   * Returns true if Tools is block
   */
  isBlock(): this is BlockToolWrapper;

  /**
   * Returns true if Tools is tune
   */
  isTune(): this is BlockTuneWrapper;

  /**
   * Constructs new Tool instance from constructable blueprint
   *
   * @param args
   */
  create(...args: any[]): ToolClass;
}
