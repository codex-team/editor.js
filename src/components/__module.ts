import { EditorModules } from '../types-internal/editor-modules';
import { EditorConfig } from '../../types';
import { ModuleConfig } from '../types-internal/module-config';

/**
 * @abstract
 * @class      Module
 * @classdesc  All modules inherits from this class.
 *
 * @typedef {Module} Module
 * @property {object} config - Editor user settings
 * @property {EditorModules} Editor - List of Editor modules
 */
export default class Module {
  /**
   * Editor modules list
   *
   * @type {EditorModules}
   */
  protected Editor: EditorModules;

  /**
   * Editor configuration object
   *
   * @type {EditorConfig}
   */
  protected config: EditorConfig;

  /**
   * @class
   * @param {EditorConfig} config - Editor's config
   */
  constructor({ config }: ModuleConfig) {
    if (new.target === Module) {
      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }

    this.config = config;
  }

  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  public set state(Editor: EditorModules) {
    this.Editor = Editor;
  }
}
