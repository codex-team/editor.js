import { BlockToolWrapper } from './block-tool-wrapper';
import { BlockTuneWrapper } from './block-tune-wrapper';
import { InlineToolWrapper } from './inline-tool-wrapper';
import { ToolWrapper } from './tool-wrapper';

/**
 * Interface for a collection of tools.
 */
export interface ToolsCollection<V extends ToolWrapper = ToolWrapper> {
  /**
   * Returns Block Tools collection
   */
  blockTools: ToolsCollection<BlockToolWrapper>;

  /**
   * Returns Inline Tools collection
   */
  inlineTools: ToolsCollection<InlineToolWrapper>;

  /**
   * Returns Block Tunes collection
   */
  blockTunes: ToolsCollection<BlockTuneWrapper>;

  /**
   * Returns internal Tools collection
   */
  internalTools: ToolsCollection<V>;

  /**
   * Returns Tools collection provided by user
   */
  externalTools: ToolsCollection<V>;
}
