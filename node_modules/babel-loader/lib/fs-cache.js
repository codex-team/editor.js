"use strict";

var crypto = require("crypto");
var mkdirp = require("mkdirp");
var findCacheDir = require("find-cache-dir");
var fs = require("fs");
var os = require("os");
var path = require("path");
var zlib = require("zlib");

var read = function read(filename, callback) {
  return fs.readFile(filename, function (err, data) {
    if (err) {
      return callback(err);
    }

    return zlib.gunzip(data, function (err, content) {
      var result = {};

      if (err) {
        return callback(err);
      }

      try {
        result = JSON.parse(content);
      } catch (e) {
        return callback(e);
      }

      return callback(null, result);
    });
  });
};

var write = function write(filename, result, callback) {
  var content = JSON.stringify(result);

  return zlib.gzip(content, function (err, data) {
    if (err) {
      return callback(err);
    }

    return fs.writeFile(filename, data, callback);
  });
};

var filename = function filename(source, identifier, options) {
  var hash = crypto.createHash("SHA1");
  var contents = JSON.stringify({
    source: source,
    options: options,
    identifier: identifier
  });

  hash.end(contents);

  return hash.read().toString("hex") + ".json.gz";
};

var handleCache = function handleCache(directory, params, callback) {
  var source = params.source;
  var options = params.options || {};
  var transform = params.transform;
  var identifier = params.identifier;
  var shouldFallback = typeof params.directory !== "string" && directory !== os.tmpdir();

  mkdirp(directory, function (err) {
    if (err) return shouldFallback ? handleCache(os.tmpdir(), params, callback) : callback(err);

    var file = path.join(directory, filename(source, identifier, options));

    return read(file, function (err, content) {
      var result = {};

      if (!err) return callback(null, content);

      try {
        result = transform(source, options);
      } catch (error) {
        return callback(error);
      }

      return write(file, result, function (err) {
        if (err) return shouldFallback ? handleCache(os.tmpdir(), params, callback) : callback(err);

        callback(null, result);
      });
    });
  });
};

module.exports = function (params, callback) {
  var directory = void 0;

  if (typeof params.directory === "string") {
    directory = params.directory;
  } else {
    directory = findCacheDir({ name: "babel-loader" }) || os.tmpdir();
  }

  handleCache(directory, params, callback);
};