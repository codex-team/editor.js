var test = require('tape');
var crypto = require('../');
test('ciphers', function (t) {
  crypto.listCiphers().forEach(function (cipher) {
    t.test(cipher, function (t) {
      t.plan(1);
      var data = crypto.randomBytes(562);
      var password = crypto.randomBytes(20);
      var crypter = crypto.createCipher(cipher, password);
      var decrypter = crypto.createDecipher(cipher, password);
      var out = [];
      out.push(decrypter.update(crypter.update(data)));
      out.push(decrypter.update(crypter.final()));
      out.push(decrypter.final());
      t.equals(data.toString('hex'), Buffer.concat(out).toString('hex'));
    });
  });
});