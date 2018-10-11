import IBlockToolData from "./tools/block-tool-data";
import {ToolConfig, ToolConstructable} from "./tools";

export type ToolLike = ToolData | ToolConstructable

export interface ToolData {
  class: ToolConstructable,
  inlineToolbar?: string[] | boolean,
  shortcut?: string;
  config?: ToolConfig
}

export interface Configuration {
  holderId: string;
  initialBlock?: string;
  placeholder?: string;
  sanitizer?: any;
  hideToolbar?: boolean;
  tools?: { [name: string]: ToolLike };

  onReady?(): void;

  onChange?(): void;

  data?: EditorData
}

export interface EditorData {
  time?: number,
  version?: string,
  blocks?: IBlockToolData[]
}
