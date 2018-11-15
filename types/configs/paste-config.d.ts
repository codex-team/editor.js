import {BlockToolData} from "../index";


/**
 * Tool onPaste configuration object
 */
export interface PasteConfig {
  tags?: string[];
  handler?: (element: HTMLElement) => BlockToolData;
  patterns?: {[key: string]: RegExp};
  patternHandler?: (text: string, key: string) => BlockToolData;
  files?: {extensions?: string[], mimeTypes?: string[]};
  fileHandler?: (file: File) => BlockToolData;
}
