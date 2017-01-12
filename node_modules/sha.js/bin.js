#! /usr/bin/env node

var createHash = require('./browserify')

var argv = process.argv.slice(2)

if(/--help|-h/.test(argv[0])) return usage()

function stream (alg, s) {
  var start = Date.now()
  var hash = createHash(alg || 'sha1')
  s
  .on('data', function (data) {
    hash.update(data)
  })
  .on('end', function (data) {
    if(process.env.DEBUG)
      return console.log(hash.digest('hex'), Date.now() - start)
    console.log(hash.digest('hex'))
  })
}
 
if(!process.stdin.isTTY) {
  stream(argv[0], process.stdin)
} else if (argv.length) {
  var filename = argv.pop()
  var alg = argv.pop()
  stream(alg, require('fs').createReadStream(filename))
} else {
  usage()
}

function usage () {
  console.error('sha.js [algorithm=sha1] [filename] # hash filename with algorithm')
  console.error('input | sha.js [algorithm=sha1]    # hash stdin with algorithm')
  console.error('sha.js --help                      # display this message')
}
