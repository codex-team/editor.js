/**
 * Codex Sanitizer
 */

module.exports = (function (sanitizer) {

    /** HTML Janitor library */
    let janitor = require('html-janitor');

    /** Codex Editor */
    let editor  = codex.editor;

    sanitizer.prepare = function () {

        if (editor.settings.sanitizer && !editor.core.isEmpty(editor.settings.sanitizer)) {

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
                },
                i: {},
                b: {},
                strong: {},
                em: {},
                span: {}
            }
        }
    };

    sanitizer.Config = Config;

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
    sanitizer.clean = function(dirtyString, customConfig) {

        let janitorInstance = init_(customConfig);

        return janitorInstance.clean(dirtyString);

    };

    return sanitizer;

})({});