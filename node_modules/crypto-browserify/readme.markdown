# crypto-browserify

A (partial) port of node's `crypto` module to the browser.

[![travis](https://secure.travis-ci.org/dominictarr/crypto-browserify.png?branch=master)](https://travis-ci.org/dominictarr/crypto-browserify)

[![browser support](http://ci.testling.com/dominictarr/crypto-browserify.png)](http://ci.testling.com/dominictarr/crypto-browserify)

The goal of this module is to reimplement node's crypto module,
in pure javascript so that it can run in the browser.

Here is the subset that is currently implemented:

* createHash (sha1, sha256, sha512, md5, rmd160)
* createHmac (sha1, sha256, sha512, md5)
* pbkdf2
* pbkdf2Sync
* randomBytes
* createCipher (aes)
* createDecipher (aes)

## TODO

The highest priority unimplemented features are

* createDiffieHelman
* createSign (rsa)
* createVerify (rsa)

## contributions

If you are interested in writing a feature, please implement as a new module,
which will be incorporated into crypto-browserify as a dependency.

All deps must be compatible with node's crypto
(generate example inputs and outputs with node,
and save base64 strings inside JSON, so that tests can run in the browser.
see [sha.js](https://github.com/dominictarr/sha.js)

Crypto is _extra serious_ so please do not hesitate to review the code,
and post comments if you do.

## License

MIT


