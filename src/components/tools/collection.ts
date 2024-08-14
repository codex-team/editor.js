import type BlockToolAdapter from './block';
import type InlineToolAdapter from './inline';
import type BlockTuneAdapter from './tune';
import type { ToolsCollection as ToolsCollectionInterface } from '@/types/tools/adapters/tools-collection';


export type ToolClass = BlockToolAdapter | InlineToolAdapter | BlockTuneAdapter;

/**
 * Class to store Editor Tools
 */
export default class ToolsCollection<V extends ToolClass = ToolClass> extends Map<string, V> implements ToolsCollectionInterface<V> {
  /**
   * Returns Block Tools collection
   */
  public get blockTools(): ToolsCollection<BlockToolAdapter> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isBlock()) as [string, BlockToolAdapter][];

    return new ToolsCollection<BlockToolAdapter>(tools);
  }

  /**
   * Returns Inline Tools collection
   */
  public get inlineTools(): ToolsCollection<InlineToolAdapter> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isInline()) as [string, InlineToolAdapter][];

    return new ToolsCollection<InlineToolAdapter>(tools);
  }

  /**
   * Returns Block Tunes collection
   */
  public get blockTunes(): ToolsCollection<BlockTuneAdapter> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isTune()) as [string, BlockTuneAdapter][];

    return new ToolsCollection<BlockTuneAdapter>(tools);
  }

  /**
   * Returns internal Tools collection
   */
  public get internalTools(): ToolsCollection<V> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isInternal);

    return new ToolsCollection<V>(tools);
  }

  /**
   * Returns Tools collection provided by user
   */
  public get externalTools(): ToolsCollection<V> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => !tool.isInternal);

    return new ToolsCollection<V>(tools);
  }
}
