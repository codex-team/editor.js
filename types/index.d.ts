import {EditorConfig} from './configs';
import * as APIMethods from './api';

/**
 * Interfaces used for development
 */
declare namespace EditorJS {
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
  export {EditorConfig, SanitizerConfig} from './configs';
  export {OutputData} from './data-formats/output-data';
  export {Block} from './block';

  export interface API {
    blocks: APIMethods.blocks;
    events: APIMethods.events;
    listeners: APIMethods.listeners;
    sanitizer: APIMethods.sanitizer;
    saver: APIMethods.saver;
    selection: APIMethods.selection;
    styles: APIMethods.styles;
    caret: APIMethods.caret;
    toolbar: APIMethods.toolbar;
  }
}

/**
 * Main Editor class
 */
declare class EditorJS {
  public static version: string;

  public isReady: Promise<void>;

  public saver: APIMethods.saver;
  public blocks: APIMethods.blocks;
  public events: APIMethods.events;
  public listeners: APIMethods.listeners;
  public sanitizer: APIMethods.sanitizer;
  public selection: APIMethods.selection;
  public styles: APIMethods.styles;
  public caret: APIMethods.caret;
  public toolbar: APIMethods.toolbar;

  constructor(configuration?: EditorConfig|string);

  public destroy(): void;
}

export = EditorJS;
