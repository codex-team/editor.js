import {EditorConfig} from './configs';
import * as API from './api';

declare namespace EditorJS {
  export * from './tools';
  export * from './block-tunes';
  export * from './configs';
  export * from './data-formats/output-data';
  export * from './api';
  export * from './block';
}

// declare class EditorJS {
//   public static version: string;
//
//   public isReady: Promise<void>;
//
//   public saver: API.saver;
//   public blocks: API.blocks;
//   public events: API.events;
//   public listeners: API.listeners;
//   public sanitizer: API.sanitizer;
//   public selection: API.selection;
//   public styles: API.styles;
//   public caret: API.caret;
//   public toolbar: API.toolbar;
//
//   constructor(configuration?: EditorConfig|string);
//
//   public destroy(): void;
// }

export = EditorJS;
