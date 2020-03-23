import {API, BlockAPI, ToolConfig} from '../index';
import {BlockTuneData} from './block-tune-data';

/**
 * Describes BLockTune blueprint
 */
export interface BlockTune {
  /**
   * Returns block tune HTMLElement
   *
   * @return {HTMLElement}
   */
  render(): HTMLElement;

  /**
   * Method called on Tool render. Pass Tool content as an argument.
   *
   * You can wrap Tool's content with any wrapper you want to provide Tune's UI
   *
   * @param {HTMLElement} pluginsContent — Tool's content wrapper
   *
   * @return {HTMLElement}
   */
  wrap?(pluginsContent: HTMLElement): HTMLElement;

  /**
   * Called on Tool's saving. Should return any data Tune needs to save
   *
   * @return {BlockTuneData}
   */
  save?(): BlockTuneData;
}

/**
 * Describes BlockTune class constructor function
 */
export type BlockTuneConstructable = new (config: {
  api: API,
  settings?: ToolConfig,
  block: BlockAPI,
  data: BlockTuneData,
}) => BlockTune;
