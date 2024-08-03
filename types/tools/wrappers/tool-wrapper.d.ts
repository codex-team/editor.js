import { BlockToolWrapper } from './block-tool-wrapper';
import { BlockTuneWrapper } from './block-tune-wrapper';
import { InlineToolWrapper } from './inline-tool-wrapper';

export type ToolWrapper = BlockToolWrapper | InlineToolWrapper | BlockTuneWrapper;
