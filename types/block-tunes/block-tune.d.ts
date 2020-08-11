import {API, ToolConfig} from '../index';

/**
 * Describes BLockTune blueprint
 */
export interface BlockTune {
  /**
   * Returns block tune HTMLElement
   *
   * @return {HTMLElement[] | HTMLElement}
   */
  render(): HTMLElement[] | HTMLElement;
}

/**
 * Describes BlockTune class constructor function
 */
export interface BlockTuneConstructable {
  new (config: {api: API, settings?: ToolConfig}): BlockTune;
}

export type AlignmentType = 'right' | 'center' | 'left';

export type AlignmentButtonType = { icon: string; alignment: AlignmentType; t: string; };
