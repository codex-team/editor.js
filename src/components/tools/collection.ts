import type BlockTool from './block';
import type InlineTool from './inline';
import type BlockTune from './tune';
import type { ToolsCollection as IToolsCollection } from '@/types/tools/adapters/tools-collection';


export type ToolClass = BlockTool | InlineTool | BlockTune;

/**
 * Class to store Editor Tools
 */
export default class ToolsCollection<V extends ToolClass = ToolClass> extends Map<string, V> implements IToolsCollection<V> {
  /**
   * Returns Block Tools collection
   */
  public get blockTools(): ToolsCollection<BlockTool> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isBlock()) as [string, BlockTool][];

    return new ToolsCollection<BlockTool>(tools);
  }

  /**
   * Returns Inline Tools collection
   */
  public get inlineTools(): ToolsCollection<InlineTool> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isInline()) as [string, InlineTool][];

    return new ToolsCollection<InlineTool>(tools);
  }

  /**
   * Returns Block Tunes collection
   */
  public get blockTunes(): ToolsCollection<BlockTune> {
    const tools = Array
      .from(this.entries())
      .filter(([, tool]) => tool.isTune()) as [string, BlockTune][];

    return new ToolsCollection<BlockTune>(tools);
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
