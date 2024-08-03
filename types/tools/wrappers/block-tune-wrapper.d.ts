import { BlockAPI, BlockTune, BlockTuneConstructable } from '../..';
import { BlockTuneData } from '../../block-tunes/block-tune-data';
import { BaseToolWrapper } from './base-tool-wrapper';
import { ToolType } from './tool-type';

interface BlockTuneWrapper extends BaseToolWrapper<ToolType.Tune, BlockTune> {
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(data: BlockTuneData, block: BlockAPI): BlockTune;
}
