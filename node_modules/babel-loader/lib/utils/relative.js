"use strict";

var path = require("path");

module.exports = function relative(sourceRoot, filename) {
  var rootPath = sourceRoot.replace(/\\/g, "/").split("/")[1];
  var fileRootPath = filename.replace(/\\/g, "/").split("/")[1];

  if (rootPath && rootPath !== fileRootPath) {
    return filename;
  }

  return path.relative(sourceRoot, filename);
};