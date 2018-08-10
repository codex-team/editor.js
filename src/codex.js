'use strict';

/**
 * Apply polyfills
 */
import 'babel-core/register';
if (!window || !window._babelPolyfill) require('babel-polyfill');
import 'components/polyfills';
import Core from './components/core';

/**
 * Codex Editor
 *
 * Short Description (눈_눈;)
 * @version 2.0
 *
 * @author CodeX-Team <https://ifmo.su>
 */
export default class CodexEditor {
  /** Editor version */
  static get version() {
    return VERSION;
  }

  /**
   * @constructor
   *
   * @param {EditorConfig} configuration - user configuration
   */
  constructor(configuration) {
    let {onReady} = configuration;

    onReady = onReady && typeof onReady === 'function' ? onReady : () => {};

    configuration.onReady = () => {};

    const editor = new Core(configuration);

    /**
     * We need to export isReady promise in the constructor as it can be used before other API methods are exported
     * @type {Promise<any | never>}
     */
    this.isReady = editor.isReady.then(() => {
      this.exportAPI(editor);
      onReady();
    });
  }

  /**
   * Export external API methods
   *
   * @param editor
   */
  exportAPI(editor) {
    const fieldsToExport = [ 'configuration' ];
    const destroy = () => {
      editor.moduleInstances.Listeners.removeAll();
      editor.moduleInstances.UI.destroy();
      editor = null;

      for (const field in this) {
        delete this[field];
      }

      Object.setPrototypeOf(this, null);
    };

    fieldsToExport.forEach(field => {
      this[field] = editor[field];
    });

    this.destroy = destroy;

    Object.setPrototypeOf(this, editor.moduleInstances.API.methods);

    delete this['exportAPI'];
  }
}
