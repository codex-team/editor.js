import { Tool, ToolSettings } from '..';
import type { SanitizerConfig } from '../..';

import { ToolType } from './tool-type';
import { InlineToolFactory } from './inline-tool-factory';
import { BlockToolFactory } from './block-tool-factory';
import { BlockTuneFactory } from './block-tune-factory';

export interface BaseToolFactory<Type extends ToolType, ToolClass extends Tool> {
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
  isInline(): this is InlineToolFactory;

  /**
   * Returns true if Tools is block
   */
  isBlock(): this is BlockToolFactory;

  /**
   * Returns true if Tools is tune
   */
  isTune(): this is BlockTuneFactory;

  /**
   * Constructs new Tool instance from constructable blueprint
   *
   * @param args
   */
  create(...args: any[]): ToolClass;
}
