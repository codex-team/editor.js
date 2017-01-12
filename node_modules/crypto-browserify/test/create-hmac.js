
var test = require('tape')

var algorithms = require('../').getHashes()
var vectors = require('hash-test-vectors/hmac')
var createHmac = require('../create-hmac')

algorithms.forEach(function (alg) {

  test('hmac('+alg+')', function (t) {
    vectors.forEach(function (input, i) {
      var output = createHmac(alg, new Buffer(input.key, 'hex'))
          .update(input.data, 'hex').digest()

      output = input.truncate ? output.slice(0, input.truncate) : output
      t.equal(output.toString('hex'), input[alg])
    })
    t.end()
  })

})



