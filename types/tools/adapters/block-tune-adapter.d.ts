import { BlockAPI, BlockTune } from '../..';
import { BlockTuneData } from '../../block-tunes/block-tune-data';
import { BaseToolAdapter } from './base-tool-adapter';
import { ToolType } from './tool-type';

interface BlockTuneAdapter extends BaseToolAdapter<ToolType.Tune, BlockTune> {
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(data: BlockTuneData, block: BlockAPI): BlockTune;
}
