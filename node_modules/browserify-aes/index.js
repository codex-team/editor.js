var crypto = require('crypto');

exports.__browserify = require('./inject')
exports.__browserify(crypto, module.exports);
