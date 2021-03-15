import BaseTool from './base';
import { ToolType } from '../modules/tools';
import {BlockAPI, BlockTune as IBlockTune, BlockTuneConstructable} from '../../../types';
import {BlockTuneData} from '../../../types/block-tunes/block-tune-data';

/**
 * Stub class for BlockTunes
 *
 * @todo Implement
 */
export default class BlockTune extends BaseTool<any> {
  /**
   * Tool type — Tune
   */
  public type = ToolType.Tune;

  protected readonly constructable: BlockTuneConstructable;

  /**
   * @todo implement
   */
  public instance(data: BlockTuneData, block: BlockAPI): IBlockTune {
    return new this.constructable({
      api: this.api,
      settings: this.settings,
      block,
      data
    });
  }
}
