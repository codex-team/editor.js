var test = require('tape');
var fixtures = require('./fixtures.json');
var _crypto = require('crypto');
var crypto = require('../');
var modes = require('../modes');
var types = Object.keys(modes);
var ebtk = require('../EVP_BytesToKey');
fixtures.forEach(function (fixture, i) {
  //var ciphers = fixture.results.ciphers = {};
  types.forEach(function (cipher) {
    test('fixture ' + i + ' ' + cipher, function (t) {
      t.plan(1);
      var suite = crypto.createCipher(cipher, new Buffer(fixture.password));
      var buf = new Buffer('');
      suite.on('data', function (d) {
        buf = Buffer.concat([buf, d]);
      });
      suite.on('error', function (e) {
        console.log(e);
      });
      suite.on("end", function () {
        // console.log(fixture.text);
        // decriptNoPadding(cipher, new Buffer(fixture.password), buf.toString('hex'), 'a');
        // decriptNoPadding(cipher, new Buffer(fixture.password), fixture.results.ciphers[cipher], 'b');
        t.equals(buf.toString('hex'), fixture.results.ciphers[cipher]);
      });
      suite.write(new Buffer(fixture.text));
      suite.end();
    });
    test('fixture ' + i + ' ' + cipher + '-legacy', function (t) {
      t.plan(3);
      var suite = crypto.createCipher(cipher, new Buffer(fixture.password));
      var buf = new Buffer('');
      var suite2 = _crypto.createCipher(cipher, new Buffer(fixture.password));
      var buf2 = new Buffer('');
      var inbuf = new Buffer(fixture.text);
      var mid = ~~(inbuf.length/2);
      buf = Buffer.concat([buf, suite.update(inbuf.slice(0, mid))]);
      buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(0, mid))]);
      t.equals(buf.toString('hex'), buf2.toString('hex'), 'intermediate');
      buf = Buffer.concat([buf, suite.update(inbuf.slice(mid))]);
      buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(mid))]);
      t.equals(buf.toString('hex'), buf2.toString('hex'), 'intermediate 2');
      buf = Buffer.concat([buf, suite.final()]);
      buf2 = Buffer.concat([buf2, suite2.final()]);
      t.equals(buf.toString('hex'), buf2.toString('hex'), 'final');
    });
    test('fixture ' + i + ' ' + cipher + '-decrypt', function (t) {
      t.plan(1);
      var suite = crypto.createDecipher(cipher, new Buffer(fixture.password));
      var buf = new Buffer('');
      suite.on('data', function (d) {
        buf = Buffer.concat([buf, d]);
      });
      suite.on('error', function (e) {
        console.log(e);
      });
      suite.on("end", function () {
        // console.log(fixture.text);
        // decriptNoPadding(cipher, new Buffer(fixture.password), buf.toString('hex'), 'a');
        // decriptNoPadding(cipher, new Buffer(fixture.password), fixture.results.ciphers[cipher], 'b');
        t.equals(buf.toString('utf8'), fixture.text);
      });
      suite.write(new Buffer(fixture.results.ciphers[cipher], 'hex'));
      suite.end();
    });
    test('fixture ' + i + ' ' + cipher + '-decrypt-legacy', function (t) {
      t.plan(4);
      var suite = crypto.createDecipher(cipher, new Buffer(fixture.password));
      var buf = new Buffer('');
      var suite2 = _crypto.createDecipher(cipher, new Buffer(fixture.password));
      var buf2 = new Buffer('');
      var inbuf = new Buffer(fixture.results.ciphers[cipher], 'hex');
      var mid = ~~(inbuf.length/2);
      buf = Buffer.concat([buf, suite.update(inbuf.slice(0, mid))]);
      buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(0, mid))]);
      t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'intermediate');
      buf = Buffer.concat([buf, suite.update(inbuf.slice(mid))]);
      buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(mid))]);
      t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'intermediate 2');
      buf = Buffer.concat([buf, suite.final()]);
      buf2 = Buffer.concat([buf2, suite2.final()]);
      t.equals(buf.toString('utf8'), fixture.text);
      t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'final');
    });
    //var cipherivs = fixture.results.cipherivs = {};
    types.forEach(function (cipher) {
      if (modes[cipher].mode === 'ECB') {
        return;
      }
      test('fixture ' + i + ' ' + cipher + '-iv', function (t) {
        t.plan(1);
        var suite = crypto.createCipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf = new Buffer('');
        suite.on('data', function (d) {
          buf = Buffer.concat([buf, d]);
        });
        suite.on('error', function (e) {
          console.log(e);
        });
        suite.on("end", function () {
          t.equals(buf.toString('hex'), fixture.results.cipherivs[cipher]);
        });
        suite.write(new Buffer(fixture.text));
        suite.end();
      });
      test('fixture ' + i + ' ' + cipher + '-legacy-iv', function (t) {
        t.plan(4);
        var suite = crypto.createCipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf = new Buffer('');
        var suite2 = _crypto.createCipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf2 = new Buffer('');
        var inbuf = new Buffer(fixture.text);
        var mid = ~~(inbuf.length/2);
        buf = Buffer.concat([buf, suite.update(inbuf.slice(0, mid))]);
        buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(0, mid))]);
        t.equals(buf.toString('hex'), buf2.toString('hex'), 'intermediate');
        buf = Buffer.concat([buf, suite.update(inbuf.slice(mid))]);
        buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(mid))]);
        t.equals(buf.toString('hex'), buf2.toString('hex'), 'intermediate 2');
        buf = Buffer.concat([buf, suite.final()]);
        buf2 = Buffer.concat([buf2, suite2.final()]);
        t.equals(buf.toString('hex'), fixture.results.cipherivs[cipher]);
        t.equals(buf.toString('hex'), buf2.toString('hex'), 'final');
      });
      test('fixture ' + i + ' ' + cipher + '-iv-decrypt', function (t) {
        t.plan(1);
        var suite = crypto.createDecipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf = new Buffer('');
        suite.on('data', function (d) {
          buf = Buffer.concat([buf, d]);
        });
        suite.on('error', function (e) {
          console.log(e);
        });
        suite.on("end", function () {
            t.equals(buf.toString('utf8'), fixture.text);
        });
        suite.write(new Buffer(fixture.results.cipherivs[cipher], 'hex'));
        suite.end();
      });
      test('fixture ' + i + ' ' + cipher + '-decrypt-legacy', function (t) {
        t.plan(4);
        var suite = crypto.createDecipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf = new Buffer('');
        var suite2 = _crypto.createDecipheriv(cipher, ebtk(_crypto, fixture.password, modes[cipher].key).key, new Buffer(fixture.iv, 'hex'));
        var buf2 = new Buffer('');
        var inbuf = new Buffer(fixture.results.cipherivs[cipher], 'hex');
        var mid = ~~(inbuf.length/2);
        buf = Buffer.concat([buf, suite.update(inbuf.slice(0, mid))]);
        buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(0, mid))]);
        t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'intermediate');
        buf = Buffer.concat([buf, suite.update(inbuf.slice(mid))]);
        buf2 = Buffer.concat([buf2, suite2.update(inbuf.slice(mid))]);
        t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'intermediate 2');
        buf = Buffer.concat([buf, suite.final()]);
        buf2 = Buffer.concat([buf2, suite2.final()]);
        t.equals(buf.toString('utf8'), fixture.text);
        t.equals(buf.toString('utf8'), buf2.toString('utf8'), 'final');
      });
    });
  });
});
