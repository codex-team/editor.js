import EditorModules from './interfaces/editor';
import ModuleConfiguration from './interfaces/module-config';
import {Configuration} from './interfaces/data-format';

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
  protected Editor: EditorModules;

  /**
   * Editor configuration object
   * @type {Configuration}
   */
  protected config: Configuration;

  /**
   * @constructor
   * @param {ModuleConfiguration}
   */
  constructor({config}: {config: Configuration}) {
    if (new.target === Module) {
      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }

    this.config = config;
  }

  /**
   * Editor modules setter
   * @param {IEditor} Editor
   */
  set state(Editor: EditorModules) {
    this.Editor = Editor;
  }
}
