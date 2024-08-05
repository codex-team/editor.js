import { BlockToolFactory } from './block-tool-factory';
import { BlockTuneFactory } from './block-tune-factory';
import { InlineToolFactory } from './inline-tool-factory';
import { ToolFactory } from './tool-factory';

/**
 * Interface for a collection of tools.
 */
export interface ToolsCollection<V extends ToolFactory = ToolFactory> {
  /**
   * Returns Block Tools collection
   */
  blockTools: ToolsCollection<BlockToolFactory>;

  /**
   * Returns Inline Tools collection
   */
  inlineTools: ToolsCollection<InlineToolFactory>;

  /**
   * Returns Block Tunes collection
   */
  blockTunes: ToolsCollection<BlockTuneFactory>;

  /**
   * Returns internal Tools collection
   */
  internalTools: ToolsCollection<V>;

  /**
   * Returns Tools collection provided by user
   */
  externalTools: ToolsCollection<V>;
}
