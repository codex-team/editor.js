/**
 * For export type there should be one entry point,
 * so we export all types from this file
 * ------------------------------------
 */

import {
  Dictionary,
  DictValue,
  EditorConfig,
  I18nConfig,
  I18nDictionary,
} from './configs';

import {
  Blocks,
  Caret,
  Events,
  InlineToolbar,
  Listeners,
  Notifier,
  ReadOnly,
  Sanitizer,
  Saver,
  Selection,
  Styles,
  Toolbar,
  Tooltip,
  I18n,
  Ui,
} from './api';

import { OutputData } from './data-formats';
import { BlockMutationEventMap } from './events/block';
import { BlockAddedMutationType, BlockAddedEvent } from './events/block/BlockAdded';
import { BlockChangedMutationType, BlockChangedEvent } from './events/block/BlockChanged';
import { BlockMovedMutationType, BlockMovedEvent } from './events/block/BlockMoved';
import { BlockRemovedMutationType, BlockRemovedEvent } from './events/block/BlockRemoved';

/**
 * Interfaces used for development
 */
export {
  BaseTool,
  BaseToolConstructable,
  InlineTool,
  InlineToolConstructable,
  InlineToolConstructorOptions,
  BlockToolConstructable,
  BlockToolConstructorOptions,
  BlockTool,
  BlockToolData,
  Tool,
  ToolConstructable,
  ToolboxConfig,
  ToolboxConfigEntry,
  ToolSettings,
  ToolConfig,
  PasteEvent,
  PasteEventDetail,
  PatternPasteEvent,
  PatternPasteEventDetail,
  HTMLPasteEvent,
  HTMLPasteEventDetail,
  FilePasteEvent,
  FilePasteEventDetail,
} from './tools';
export {BlockTune, BlockTuneConstructable} from './block-tunes';
export {
  EditorConfig,
  SanitizerConfig,
  SanitizerRule,
  PasteConfig,
  LogLevels,
  ConversionConfig,
  I18nDictionary,
  Dictionary,
  DictValue,
  I18nConfig,
  PopoverItem,
  PopoverItemWithConfirmation,
  PopoverItemWithoutConfirmation
} from './configs';
export { OutputData, OutputBlockData} from './data-formats/output-data';
export { BlockId } from './data-formats/block-id';
export { BlockAPI } from './api'
export {
  BlockMutationEventMap,
  BlockAddedMutationType,
  BlockAddedEvent,
  BlockRemovedMutationType,
  BlockRemovedEvent,
  BlockMovedMutationType,
  BlockMovedEvent,
  BlockChangedMutationType,
  BlockChangedEvent,
}

/**
 * We have a namespace API {@link ./api/index.d.ts} (APIMethods) but we can not use it as interface
 * So we should create new interface for exporting API type
 */
export interface API {
  blocks: Blocks;
  caret: Caret;
  events: Events;
  listeners: Listeners;
  notifier: Notifier;
  sanitizer: Sanitizer;
  saver: Saver;
  selection: Selection;
  styles: Styles;
  toolbar: Toolbar;
  inlineToolbar: InlineToolbar;
  tooltip: Tooltip;
  i18n: I18n;
  readOnly: ReadOnly;
  ui: Ui;
}

/**
 * Main Editor class
 */
declare class EditorJS {
  public static version: string;

  public isReady: Promise<void>;

  public blocks: Blocks;
  public caret: Caret;
  public sanitizer: Sanitizer;
  public saver: Saver;
  public selection: Selection;
  public styles: Styles;
  public toolbar: Toolbar;
  public inlineToolbar: InlineToolbar;
  public readOnly: ReadOnly;
  constructor(configuration?: EditorConfig|string);

  /**
   * API shorthands
   */

  /**
   * @see Saver.save
   */
  public save(): Promise<OutputData>;

  /**
   * @see Blocks.clear
   */
  public clear(): void;

  /**
   * @see Blocks.render
   */
  public render(data: OutputData): Promise<void>;

  /**
   * @see Caret.focus
   */
  public focus(atEnd?: boolean): boolean;

  /**
   * @see Events.on
   */
  public on(eventName: string, callback: (data?: any) => void): void;

  /**
   * @see Events.off
   */
  public off(eventName: string, callback: (data?: any) => void): void;

  /**
   * @see Events.emit
   */
  public emit(eventName: string, data: any): void;

  /**
   * Destroy Editor instance and related DOM elements
   */
  public destroy(): void;
}

export as namespace EditorJS;
export default EditorJS;
