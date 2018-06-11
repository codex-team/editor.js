/**
 * @abstract
 * @class      Module
 * @classdesc  All modules inherits from this class.
 *
 * @typedef {Module} Module
 * @property {Object} config - Editor user settings
 * @property {Object} Editor - List of Editor modules
 */
export default class Module {

    /**
     * Editor modules list
     * @type {EditorComponents}
     */
    Editor: any = null;

    /**
     * Editor configuration object
     * @type {EditorConfig}
     */
    config: any = {};

    /**
     * @constructor
     *
     * @param  {EditorConfig} config
     */
    constructor({config}) {

        if (new.target === Module) {

            throw new TypeError('Constructors for abstract class Module are not allowed.');

        }

        this.config = config;
    }

    /**
     * Editor modules setter
     *
     * @param Editor
     * @param Editor.modules {@link CodexEditor#moduleInstances}
     * @param Editor.config {@link CodexEditor#configuration}
     */
    set state(Editor) {

        this.Editor = Editor;

    }

}
