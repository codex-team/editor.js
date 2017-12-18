/**
 * Codex Sanitizer
 *
 * @module Sanitizer module
 * Clears HTML from dirty tags
 *
 * @version 2.0.0
 */
export default class Sanitizer extends Module {

    /**
     * Initializes Sanitizer module
     * Sets default configuration if custom not exists
     *
     * @property {HTMLJanitor} this.janitor - Sanitizer library
     *
     * @param config
     */
    constructor(config) {
        super(config);

        // default config
        this._config = {};
        this._janitor = null;

        /** Custom configuration */
        this.sanitizerConfig = config.settings.sanitizer;

        /** HTML Janitor library */
        this.sanitizerInstance = require('html-janitor');
    }

    /**
     * @param library
     *
     * @description If developer uses editor's API, then he can customize sane restrictions.
     * Or, sane config can be defined globally in editors initialization. That config will be used everywhere
     * At least, if there is no config overrides, that API uses BASIC Default configation
     */
    set sanitizerInstance(library) {
        this._janitor = new library(this._config);
    }

    set sanitizerConfig(config) {

        this._config = {
            tags: {
                p: {},
                a: {
                    href: true,
                    target: '_blank',
                    rel: 'nofollow'
                }
            }
        };

    }

    /**
     * Cleans string from unwanted tags
     * @param dirtyString
     * @return {*}
     */
    clean(dirtyString) {
        return this._janitor.clean(dirtyString);
    }

    /**
     * Cleans string from unwanted tags
     * @static
     *
     * Method allows to use default config
     *
     * @param {String} dirtyString - taint string
     * @param {Object} customConfig - allowed tags
     */
    static clean(dirtyString, customConfig) {
        let newInstance = Sanitizer(customConfig);

        return newInstance.clean(dirtyString);
    }

}
