import BaseTool, { ToolType } from './base';
import { BlockAPI, BlockTune as IBlockTune, BlockTuneConstructable } from '../../../types';
import { BlockTuneData } from '../../../types/block-tunes/block-tune-data';

/**
 * Stub class for BlockTunes
 *
 * @todo Implement
 */
export default class BlockTune extends BaseTool<IBlockTune> {
  /**
   * Tool type — Tune
   */
  public type = ToolType.Tune;

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
