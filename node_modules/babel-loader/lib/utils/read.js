"use strict";

var fs = require("fs");

module.exports = function (cache) {
  cache = cache || {};

  return function (filename) {

    if (!filename) {
      throw new Error("filename must be a string");
    }

    cache[filename] = cache[filename] || fs.readFileSync(filename, "utf8");

    return cache[filename];
  };
};