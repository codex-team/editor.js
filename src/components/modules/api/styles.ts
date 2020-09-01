import { Styles } from '../../../../types/api';
import ApiModule from './base';

/**
 *
 */
export default class StylesAPI extends ApiModule {
  /**
   * Exported classes
   */
  public get classes(): Styles {
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
