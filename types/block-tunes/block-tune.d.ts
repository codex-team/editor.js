import * as API from '../api';

export interface BlockTune {
  render(): HTMLElement;
}

export interface BlockTuneConstructable {
  new (config: {api: API}): BlockTune
}
