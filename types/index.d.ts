/**
 * For export type there should be one entry point,
 * so we export all types from this file
 * ------------------------------------
 */

import {EditorConfig} from './configs';
import {Blocks, Caret, Events, Listeners, Notifier, Sanitizer, Saver, Selection, Styles, Toolbar, InlineToolbar} from './api';
import {OutputData} from "./data-formats/output-data";

/**
 * Interfaces used for development
 */
export {
  BaseTool,
  BaseToolConstructable,
  InlineTool,
  InlineToolConstructable,
  BlockToolConstructable,
  BlockTool,
  BlockToolData,
  Tool,
  ToolConstructable,
  ToolboxConfig,
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
export {EditorConfig, SanitizerConfig, PasteConfig} from './configs';
export {OutputData} from './data-formats/output-data';

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
}

/**
 * Main Editor class
 */
declare class EditorJS {
  public static version: string;

  public isReady: Promise<void>;

  public blocks: Blocks;
  public caret: Caret;
  public events: Events;
  public listeners: Listeners;
  public sanitizer: Sanitizer;
  public saver: Saver;
  public selection: Selection;
  public styles: Styles;
  public toolbar: Toolbar;
  public inlineToolbar: InlineToolbar;
  constructor(configuration?: EditorConfig|string);

  /**
   * API shorthands
   */

  /**
   * @see Saver.save
   */
  save(): Promise<OutputData>;

  /**
   * @see Blocks.clear
   */
  clear(): void;

  /**
   * @see Blocks.render
   */
  render(data: OutputData): Promise<void>;

  /**
   * @see Caret.focus
   */
  focus(atEnd?: boolean): boolean;

  /**
   * @see Events.on
   */
  on(eventName: string, callback: (data?: any) => void): void;

  /**
   * @see Events.off
   */
  off(eventName: string, callback: (data?: any) => void): void;

  /**
   * @see Events.emit
   */
  emit(eventName: string, data: any): void;

  /**
   * Destroy Editor instance and related DOM elements
   */
  public destroy(): void;
}

export as namespace EditorJS;
export default EditorJS;
