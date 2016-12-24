var Sanitize = require('../sanitize');

if (!Sanitize.Config) {
    Sanitize.Config = {};
}

Sanitize.Config.RESTRICTED = {
    elements: ['a', 'b', 'em', 'i', 'strong', 'u']
};

codex.sanitizer = Sanitize;
