import {IPasteConfig} from "../modules/paste";

export type ToolData = any;
export type ToolConfig = any;

export interface ToolPreparationData {
  toolName: string;
  config: ToolConfig;
}

export interface ToolConstructable {
  new (config: {api: any, config?: ToolConfig, data?: ToolData})
  name: string;
  isInline: boolean;
  prepare(data: ToolPreparationData): void;
}

export interface InlineToolConstructable extends ToolConstructable {
  new (config: {api: any}): InlineTool;
}

export interface BlockToolConstructable extends ToolConstructable {
  new (config: {api: any, config: ToolConfig, data: ToolData}): BlockTool;

  displayInToolbox?: boolean;
  toolboxIcon?: string
  enableLineBreaks?: boolean;
  irreplaceable?: boolean;
  contentless?: boolean;
  onPaste?: IPasteConfig
}

interface Tool {
  render (): HTMLElement;
}

interface BlockTool extends Tool {
  save (element: HTMLElement): ToolData;
  validate? (data: ToolData): boolean;
  merge? (data: ToolData): ToolData;
  renderSettings? (): HTMLElement;
}

interface InlineTool extends Tool {
  surround (range: Range): void;
  checkState (selection: Selection): boolean;
  renderActions? (): HTMLElement;
  clear? (): void
}
