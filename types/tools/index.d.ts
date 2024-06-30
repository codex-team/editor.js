import { BlockTool, BlockToolConstructable } from './block-tool';
import { InlineTool, InlineToolConstructable } from './inline-tool';
import { BlockTune, BlockTuneConstructable } from '../block-tunes';

export * from './block-tool';
export * from './block-tool-data';
export * from './inline-tool';
export * from './tool';
export * from './tool-config';
export * from './tool-settings';
export * from './paste-events';
export * from './hook-events';
export * from './menu-config';

export type Tool = BlockTool | InlineTool | BlockTune;
export type ToolConstructable = BlockToolConstructable | InlineToolConstructable | BlockTuneConstructable;
