import Module from '../../__module';
import {Styles} from '../../../../types/api';

/**
 *
 */
export default class StylesAPI extends Module {

  /**
   * Save Editor config
   * API provides passed configuration to the Blocks
   */
  constructor({config}) {
    super({config});
  }

  get classes(): Styles {
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
      button: 'cdx-button',

      /**
       * Settings styles
       */
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  }
}
