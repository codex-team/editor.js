import { BlockToolFactory } from './block-tool-factory';
import { BlockTuneFactory } from './block-tune-factory';
import { InlineToolFactory } from './inline-tool-factory';

export type ToolFactory = BlockToolFactory | InlineToolFactory | BlockTuneFactory;
