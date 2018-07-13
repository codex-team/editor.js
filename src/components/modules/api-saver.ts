import IInputOutputData from '../interfaces/input-output-data';

declare var Module: any;

import {ISaverAPI} from '../interfaces/api';

/**
 * @class SaverAPI
 * provides with methods to save data
 */
export default class SaverAPI extends Module implements ISaverAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   * @param {EditorsConfig} config
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {ISaverAPI}
   */
  get methods(): ISaverAPI {
    return {
      save: () => this.save(),
    };
  }

  /**
   * Return Editor's data
   */
  public save(): IInputOutputData {
    return this.Editor.Saver.save();
  }
}
