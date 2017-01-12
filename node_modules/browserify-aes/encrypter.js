var aes = require('./aes');
var Transform = require('./cipherBase');
var inherits = require('inherits');
var modes = require('./modes');
var ebtk = require('./EVP_BytesToKey');
var StreamCipher = require('./streamCipher');
inherits(Cipher, Transform);
function Cipher(mode, key, iv) {
  if (!(this instanceof Cipher)) {
    return new Cipher(mode, key, iv);
  }
  Transform.call(this);
  this._cache = new Splitter();
  this._cipher = new aes.AES(key);
  this._prev = new Buffer(iv.length);
  iv.copy(this._prev);
  this._mode = mode;
}
Cipher.prototype._transform = function (data, _, next) {
  this._cache.add(data);
  var chunk;
  var thing;
  while ((chunk = this._cache.get())) {
    thing = this._mode.encrypt(this, chunk);
    this.push(thing);
  }
  next();
};
Cipher.prototype._flush = function (next) {
  var chunk = this._cache.flush();
  this.push(this._mode.encrypt(this, chunk));
  this._cipher.scrub();
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
  if (this.cache.length > 15) {
    var out = this.cache.slice(0, 16);
    this.cache = this.cache.slice(16);
    return out;
  }
  return null;
};
Splitter.prototype.flush = function () {
  var len = 16 - this.cache.length;
  var padBuff = new Buffer(len);

  var i = -1;
  while (++i < len) {
    padBuff.writeUInt8(len, i);
  }
  var out = Buffer.concat([this.cache, padBuff]);
  return out;
};
var modelist = {
  ECB: require('./modes/ecb'),
  CBC: require('./modes/cbc'),
  CFB: require('./modes/cfb'),
  OFB: require('./modes/ofb'),
  CTR: require('./modes/ctr')
};
module.exports = function (crypto) {
  function createCipheriv(suite, password, iv) {
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
      return new StreamCipher(modelist[config.mode], password, iv);
    }
    return new Cipher(modelist[config.mode], password, iv);
  }
  function createCipher (suite, password) {
    var config = modes[suite];
    if (!config) {
      throw new TypeError('invalid suite type');
    }
    var keys = ebtk(crypto, password, config.key, config.iv);
    return createCipheriv(suite, keys.key, keys.iv);
  }
  return {
    createCipher: createCipher,
    createCipheriv: createCipheriv
  };
};
