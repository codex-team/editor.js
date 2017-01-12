"use strict";

var fs = require("fs");

module.exports = function (cache) {
  cache = cache || {};

  return function (filename) {

    if (!filename) {
      return false;
    }

    cache[filename] = cache[filename] || fs.existsSync(filename);

    return cache[filename];
  };
};