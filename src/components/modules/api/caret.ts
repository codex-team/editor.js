import Module from '../../__module';
import {Caret} from '../../../../types/api';
import {ModuleConfig} from '../../../types-internal/module-config';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module {
  /**
   * Available methods
   * @return {Caret}
   */
  get methods(): Caret {
    return {};
  }
}
