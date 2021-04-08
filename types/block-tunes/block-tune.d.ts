import {API, BlockAPI, ToolConfig} from '../index';
import { BlockTuneData } from './block-tune-data';

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
   * @param {HTMLElement} pluginsContent — Tool's content wrapper
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
export interface BlockTuneConstructable {

  /**
   * Flag show Tool is Block Tune
   */
  isTune: boolean;

  /**
   * @constructor
   *
   * @param config - Block Tune config
   */
  new(config: {
    api: API,
    settings?: ToolConfig,
    block: BlockAPI,
    data: BlockTuneData,
  }): BlockTune;

  /**
   * Tune`s prepare method. Can be async
   * @param data
   */
  prepare?(): Promise<void> | void;

  /**
   * Tune`s reset method to clean up anything set by prepare. Can be async
   */
  reset?(): void | Promise<void>;
}
