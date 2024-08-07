import { BlockToolAdapter } from './block-tool-adapter';
import { BlockTuneAdapter } from './block-tune-adapter';
import { InlineToolAdapter } from './inline-tool-adapter';
import { ToolFactory } from './tool-factory';

/**
 * Interface for a collection of tools.
 */
export interface ToolsCollection<V extends ToolFactory = ToolFactory> {
  /**
   * Returns Block Tools collection
   */
  blockTools: ToolsCollection<BlockToolAdapter>;

  /**
   * Returns Inline Tools collection
   */
  inlineTools: ToolsCollection<InlineToolAdapter>;

  /**
   * Returns Block Tunes collection
   */
  blockTunes: ToolsCollection<BlockTuneAdapter>;

  /**
   * Returns internal Tools collection
   */
  internalTools: ToolsCollection<V>;

  /**
   * Returns Tools collection provided by user
   */
  externalTools: ToolsCollection<V>;
}
