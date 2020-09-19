import { Styles } from '../../../../types/api';
import Module from '../../__module';

/**
 *
 */
export default class StylesAPI extends Module {
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
