import Module from '../__module';

import {ICaretAPI} from '../interfaces/api';
import IModuleConfig from '../interfaces/module-config';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module implements ICaretAPI {

  /**
   * Save Editor config. API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  /**
   * Available methods
   * @return {ICaretAPI}
   */
  get methods(): ICaretAPI {
    return {};
  }
}
