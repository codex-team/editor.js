var aes = require('./aes');
var Transform = require('./cipherBase');
var inherits = require('inherits');
var modes = require('./modes');
var StreamCipher = require('./streamCipher');
var ebtk = require('./EVP_BytesToKey');

inherits(Decipher, Transform);
function Decipher(mode, key, iv) {
  if (!(this instanceof Decipher)) {
    return new Decipher(mode, key, iv);
  }
  Transform.call(this);
  this._cache = new Splitter();
  this._last = void 0;
  this._cipher = new aes.AES(key);
  this._prev = new Buffer(iv.length);
  iv.copy(this._prev);
  this._mode = mode;
}
Decipher.prototype._transform = function (data, _, next) {
  this._cache.add(data);
  var chunk;
  var thing;
  while ((chunk = this._cache.get())) {
    thing = this._mode.decrypt(this, chunk);
    this.push(thing);
  }
  next();
};
Decipher.prototype._flush = function (next) {
  var chunk = this._cache.flush();
  if (!chunk) {
    return next;
  }

  this.push(unpad(this._mode.decrypt(this, chunk)));

  next();
};

function Splitter() {
   if (!(this instanceof Splitter)) {
    return new Splitter();
  }
  this.cache = new Buffer('');
}
Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data]);
};

Splitter.prototype.get = function () {
  if (this.cache.length > 16) {
    var out = this.cache.slice(0, 16);
    this.cache = this.cache.slice(16);
    return out;
  }
  return null;
};
Splitter.prototype.flush = function () {
  if (this.cache.length) {
    return this.cache;
  }
};
function unpad(last) {
  var padded = last[15];
  if (padded === 16) {
    return;
  }
  return last.slice(0, 16 - padded);
}

var modelist = {
  ECB: require('./modes/ecb'),
  CBC: require('./modes/cbc'),
  CFB: require('./modes/cfb'),
  OFB: require('./modes/ofb'),
  CTR: require('./modes/ctr')
};

module.exports = function (crypto) {
  function createDecipheriv(suite, password, iv) {
    var config = modes[suite];
    if (!config) {
      throw new TypeError('invalid suite type');
    }
    if (typeof iv === 'string') {
      iv = new Buffer(iv);
    }
    if (typeof password === 'string') {
      password = new Buffer(password);
    }
    if (password.length !== config.key/8) {
      throw new TypeError('invalid key length ' + password.length);
    }
    if (iv.length !== config.iv) {
      throw new TypeError('invalid iv length ' + iv.length);
    }
    if (config.type === 'stream') {
      return new StreamCipher(modelist[config.mode], password, iv, true);
    }
    return new Decipher(modelist[config.mode], password, iv);
  }

  function createDecipher (suite, password) {
    var config = modes[suite];
    if (!config) {
      throw new TypeError('invalid suite type');
    }
    var keys = ebtk(crypto, password, config.key, config.iv);
    return createDecipheriv(suite, keys.key, keys.iv);
  }
  return {
    createDecipher: createDecipher,
    createDecipheriv: createDecipheriv
  };
};
