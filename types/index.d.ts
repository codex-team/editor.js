/**
 * For export type there should be one entry point,
 * so we export all types from this file
 * ------------------------------------
 */

import {EditorConfig} from './configs';
import {Blocks, Caret, Events, Listeners, Notifier, Sanitizer, Saver, Selection, Styles, Toolbar} from './api';

/**
 * Interfaces used for development
 */
export {
  Tool,
  ToolConstructable,
  InlineTool,
  BlockToolConstructable,
  BlockTool,
  BlockToolData,
  ToolSettings,
  ToolConfig,
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

  constructor(configuration?: EditorConfig|string);

  public destroy(): void;
}

export as namespace EditorJS;
export default EditorJS;
