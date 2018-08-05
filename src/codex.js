/**
 * Codex Editor
 *
 * Short Description (눈_눈;)
 * @version 2.0.0
 *
 * How to start?
 * Example:
 *           new CodexEditor({
 *                holderId : 'codex-editor',
 *                initialBlock : 'text',
 *                placeholder : 'Write your story....',
 *                tools: {
 *                    quote: Quote,
 *                    anotherTool : AnotherTool
 *                },
 *                toolsConfig: {
 *                     quote: {
 *                        iconClassname : 'quote-icon',
 *                        displayInToolbox : true,
 *                        enableLineBreaks : true
 *                     },
 *                     anotherTool: {
 *                        iconClassname : 'tool-icon'
 *                     }
 *                 }
 *            });
 *
 * - tools is an object: {
 *       pluginName: PluginClass,
 *       .....
 *   }
 * - toolsConfig is an additional configuration that uses Codex Editor API
 *      iconClassname - CSS classname of toolbox icon
 *      displayInToolbox - if you want to see your Tool in toolbox hided in "plus" button, than set "True". By default : "False"
 *      enableLineBreaks - by default enter creates new block that set as initialblock, but if you set this property "True", enter will break the lines in current block
 *
 * @author CodeX-Team <https://ifmo.su>
 *
 */

'use strict';

/**
 * Apply polyfills
 */
import 'babel-core/register';
import 'babel-polyfill';
import 'components/polyfills';
import Core from './components/core';

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

    configuration.onReady = () => {
      this.exportAPI(editor);
      onReady();
    };

    const editor = new Core(configuration);
  }

  /**
   * Export external API methods
   *
   * @param editor
   */
  exportAPI(editor) {
    const fieldsToExport = ['configuration', 'isReady'];
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
