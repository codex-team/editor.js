/**
 * Codex Sanitizer
 */

var janitor = require('html-janitor');

module.exports = (function (sanitizer) {

    /**
     * Basic config
     */
    var Config = {

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

    sanitizer.init = janitor;

    return sanitizer;

})({});