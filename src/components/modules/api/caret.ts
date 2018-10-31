import Module from '../../__module';
import * as API from '../../../../types/api';
import {ModuleConfig} from '../../../../types/configs';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: ModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {API.caret}
   */
  get methods(): API.caret {
    return {};
  }
}
