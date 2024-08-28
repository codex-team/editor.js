import { BlockToolAdapter } from './block-tool-adapter';
import { BlockTuneAdapter } from './block-tune-adapter';
import { InlineToolAdapter } from './inline-tool-adapter';

export type ToolFactory = BlockToolAdapter | InlineToolAdapter | BlockTuneAdapter;
