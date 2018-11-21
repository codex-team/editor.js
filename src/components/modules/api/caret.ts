import Module from '../../__module';
import {Caret} from '../../../../types/api';
import {ModuleConfig} from '../../../types-internal/module-config';

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
   * @return {Caret}
   */
  get methods(): Caret {
    return {};
  }
}
