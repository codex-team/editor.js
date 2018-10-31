import Module from '../../__module';

import * as API from '../../../../types/api';
import {OutputData} from '../../../../types/data-formats/output-data';

/**
 * @class SaverAPI
 * provides with methods to save data
 */
export default class SaverAPI extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}) {
    super({config});
  }

  /**
   * Available methods
   * @return {API.saver}
   */
  get methods(): API.saver {
    return {
      save: () => this.save(),
    } as API.saver;
  }

  /**
   * Return Editor's data
   */
  public save(): Promise<OutputData> {
    return this.Editor.Saver.save();
  }
}
