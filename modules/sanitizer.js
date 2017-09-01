/**
 * Codex Sanitizer
 */

module.exports = (function () {

    let sanitizer = {};

    /** HTML Janitor library */
    let janitor = require('html-janitor');

    /** Codex Editor */
    let editor  = this;

    sanitizer.prepare = function () {

        if (editor.settings.sanitizer && !editor.modules.core.isEmpty(editor.settings.sanitizer)) {

            Config.CUSTOM = editor.settings.sanitizer;

        }

    };

    /**
     * Basic config
     */
    var Config = {

        /** User configuration */
        CUSTOM : null,

        BASIC : {

            tags: {
                p: {},
                a: {
                    href: true,
                    target: '_blank',
                    rel: 'nofollow'
                }
            }
        }
    };

    sanitizer.Config = Config;

    /**
     *
     * @param userCustomConfig
     * @returns {*}
     * @private
     *
     * @description If developer uses editor's API, then he can customize sane restrictions.
     * Or, sane config can be defined globally in editors initialization. That config will be used everywhere
     * At least, if there is no config overrides, that API uses BASIC Default configation
     */
    let init_ = function (userCustomConfig) {

        let configuration = userCustomConfig || Config.CUSTOM || Config.BASIC;

        return new janitor(configuration);

    };

    /**
     * Cleans string from unwanted tags
     * @protected
     * @param {String} dirtyString - taint string
     * @param {Object} customConfig - allowed tags
     */
    sanitizer.clean = function (dirtyString, customConfig) {

        let janitorInstance = init_(customConfig);

        return janitorInstance.clean(dirtyString);

    };

    return sanitizer;

});
