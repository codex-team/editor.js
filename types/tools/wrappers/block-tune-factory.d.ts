import { BlockAPI, BlockTune } from '../..';
import { BlockTuneData } from '../../block-tunes/block-tune-data';
import { BaseToolFactory } from './base-tool-factory';
import { ToolType } from './tool-type';

interface BlockTuneFactory extends BaseToolFactory<ToolType.Tune, BlockTune> {
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(data: BlockTuneData, block: BlockAPI): BlockTune;
}
