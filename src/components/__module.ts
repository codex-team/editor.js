import IEditor from './interfaces/editor';
import IEditorConfig from './interfaces/editor-config';
import IModuleConfig from './interfaces/module-config';

/**
 * @abstract
 * @class      Module
 * @classdesc  All modules inherits from this class.
 *
 * @typedef {Module} Module
 * @property {Object} config - Editor user settings
 * @property {IEditorConfig} Editor - List of Editor modules
 */
export default class Module {

  /**
   * Editor modules list
   * @type {IEditor}
   */
  protected Editor: IEditor;

  /**
   * Editor configuration object
   * @type {IEditorConfig}
   */
  protected config: IEditorConfig;

  /**
   * @constructor
   * @param {IModuleConfig}
   */
  constructor({config}: IModuleConfig) {
    if (new.target === Module) {
      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }

    this.config = config;
  }

  /**
   * Editor modules setter
   * @param {IEditor} Editor
   */
  set state(Editor) {
    this.Editor = Editor;
  }
}
