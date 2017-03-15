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

    sanitizer.init = function () {

        let configuration = Config.CUSTOM || Config.BASIC;

        return new janitor(configuration);

    };

    return sanitizer;

})({});