import BaseTool from './base';
import type { BlockAPI, BlockTune as IBlockTune, BlockTuneConstructable } from '@/types';
import type { BlockTuneData } from '@/types/block-tunes/block-tune-data';
import type { BlockTuneFactory } from '@/types/tools/wrappers/block-tune-factory';
import { ToolType } from '@/types/tools/wrappers/tool-type';

/**
 * Stub class for BlockTunes
 *
 * @todo Implement
 */
export default class BlockTune extends BaseTool<ToolType.Tune, IBlockTune> implements BlockTuneFactory {
  /**
   * Tool type — Tune
   */
  public type: ToolType.Tune = ToolType.Tune;

  /**
   * Tool's constructable blueprint
   */
  protected readonly constructable: BlockTuneConstructable;

  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  public create(data: BlockTuneData, block: BlockAPI): IBlockTune {
    // eslint-disable-next-line new-cap
    return new this.constructable({
      api: this.api,
      config: this.settings,
      block,
      data,
    });
  }
}
