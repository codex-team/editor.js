var assert = require('assert')
var crypto = require('crypto')
var fs   = require('fs')
var path = require('path')

var dir = path.join(__dirname, 'vectors')

var vectors = fs.readdirSync(dir)
  .sort()
  .filter(function (f) {
    return f.match(/\.dat$/)
  })
  .map(function (f) {
    return fs.readFileSync(path.join(dir, f))
  })

var hashes = {}

;['sha1', 'sha256', 'md5'].forEach(function (name) {
  hashes[name] =
    fs.readFileSync(path.join(dir, 'byte-hashes.' + name), 'ascii')
    .split(/\r?\n/)
})

var expected = []

for (var i = 0; i < vectors.length; i++) {
  var sha512 = crypto.createHash('sha512').update(new Buffer(vectors[i])).digest('hex')

  expected.push({
    input  : vectors[i].toString('base64'),
    sha1   : hashes.sha1[i],
    sha256 : hashes.sha256[i],
    sha512 : sha512
  })

  assert.equal(
    crypto.createHash('sha1').update(new Buffer(vectors[i])).digest('hex'),
    hashes.sha1[i])

  assert.equal(
    crypto.createHash('sha256').update(new Buffer(vectors[i])).digest('hex'),
    hashes.sha256[i])

  assert.equal(
    crypto.createHash('md5').update(new Buffer(vectors[i])).digest('hex'),
    hashes.md5[i])
}

console.log(JSON.stringify(expected, null, 2))
