declare var Module: any;

import IStylesAPI from '../interfaces/modules/api/styles-api';
import IModuleConfig from '../interfaces/module-config';
import IStylesButton from '../interfaces/modules/api/styles/button';
import IStylesInput from '../interfaces/modules/api/styles/input';

export default class StylesAPI extends Module implements IStylesAPI {

  /**
   * API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  get classes(): IStylesAPI {
    return {
      button: this.button,
      input: this.input,
    };
  }

  get button(): IStylesButton {
    return {
      button: 'ce-inline-tool',
      active: 'ce-inline-tool--active',
    };
  }

  get input(): IStylesInput {
    return {};
  }
}
