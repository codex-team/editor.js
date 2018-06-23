declare var Module: any;

import { IBlocksAPI } from '../interfaces/api';

/**
 *
 */
export default class BlocksAPI extends Module implements IBlocksAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  public moveDown(): void {
    console.log('moving down', this.Editor.BlockManager);
  }

  /**
   * Moves block up
   */
  public moveUp(): void {
    console.log('moving up', this.Editor.BlockManager);
  }

}
