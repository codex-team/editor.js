"use strict";

var path = require("path");
var exists = require("./utils/exists")({});
var read = require("./utils/read")({});

var find = function find(start, rel) {
  var file = path.join(start, rel);

  if (exists(file)) {
    return read(file);
  }

  var up = path.dirname(start);
  if (up !== start) {
    return find(up, rel);
  }
};

module.exports = function (loc, rel) {
  rel = rel || ".babelrc";

  return find(loc, rel);
};