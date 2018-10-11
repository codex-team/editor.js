import Module from '../../__module';

import {ISaverAPI} from '../../interfaces/api';
import IModuleConfig from '../../interfaces/module-config';
import {EditorData} from '../../interfaces/data-format';

/**
 * @class SaverAPI
 * provides with methods to save data
 */
export default class SaverAPI extends Module implements ISaverAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
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
  public save(): Promise<EditorData> {
    return this.Editor.Saver.save();
  }
}
