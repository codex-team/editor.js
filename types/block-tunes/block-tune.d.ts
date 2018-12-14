import {API, ToolConfig} from '../index';

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
}

/**
 * Describes BlockTune class constructor function
 */
export interface BlockTuneConstructable {
  new (config: {api: API, settings?: ToolConfig}): BlockTune;
}
