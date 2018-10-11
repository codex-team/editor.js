import Module from '../../__module';

import IModuleConfig from '../../interfaces/module-config';
import {IStylesAPI} from '../../interfaces/api';

/**
 *
 */
export default class StylesAPI extends Module {

  /**
   * Save Editor config
   * API provides passed configuration to the Blocks
   */
  constructor({config}: IModuleConfig) {
    super({config});
  }

  get classes(): IStylesAPI {
    return {
      /**
       * Base Block styles
       */
      block: 'cdx-block',

      /**
       * Inline Tools styles
       */
      inlineToolButton: 'ce-inline-tool',
      inlineToolButtonActive: 'ce-inline-tool--active',

      /**
       * UI elements
       */
      input: 'cdx-input',
      loader: 'cdx-loader',

      /**
       * Settings styles
       */
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  }
}
