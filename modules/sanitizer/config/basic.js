var Sanitize = require('../sanitize');

if (!Sanitize.Config) {
    Sanitize.Config = {};
}

Sanitize.Config.BASIC = {
    elements: [
        'a', 'b', 'blockquote', 'br', 'cite', 'code', 'dd', 'dl', 'dt', 'em',
        'i', 'li', 'ol', 'p', 'pre', 'q', 'small', 'strike', 'strong', 'sub',
        'sup', 'u', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'],
    attributes: {
        'a'         : ['href'],
        'blockquote': ['cite'],
        'q'         : ['cite']
    },

    add_attributes: {
        'a': {'rel': 'nofollow'}
    },

    protocols: {
        'a'         : {'href': ['ftp', 'http', 'https', 'mailto', Sanitize.RELATIVE]},
        'blockquote': {'cite': ['http', 'https', Sanitize.RELATIVE]},
        'q'         : {'cite': ['http', 'https', Sanitize.RELATIVE]}
    }
};

codex.sanitizer = Sanitize;