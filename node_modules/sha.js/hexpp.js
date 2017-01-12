

function toHex (buf, group, wrap, LE) {
  buf = buf.buffer || buf
  var s = ''
  var l = buf.byteLength || buf.length
  for(var i = 0; i < l ; i++) {
    var byte = (i&0xfffffffc)|(!LE ? i%4 : 3 - i%4)
    s = s + ((buf[byte]>>4).toString(16))
          + ((buf[byte]&0xf).toString(16))
          + (group-1==i%group ? ' ' : '')
          + (wrap-1==i%wrap ? '\n' : '')
  }
  return s
}

function reverseByteOrder(n) {
  return (
    ((n << 24) & 0xff000000)
  | ((n <<  8) & 0x00ff0000)
  | ((n >>  8) & 0x0000ff00)
  | ((n >> 24) & 0x000000ff)
  )
}

var hexpp = module.exports = function (buffer, opts) {
  opts = opts || {}
  opts.groups = opts.groups || 4
  opts.wrap = opts.wrap || 16
  return toHex(buffer, opts.groups, opts.wrap, opts.bigendian, opts.ints)
}

hexpp.defaults = function (opts) {
  return function (b) {
    return hexpp(b, opts)
  }
}

