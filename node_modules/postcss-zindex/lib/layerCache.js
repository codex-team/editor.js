'use strict';

var has = require('has');
var uniq = require('uniqs');

function LayerCache (opts) {
    if (!(this instanceof LayerCache)) {
        return new LayerCache(opts);
    }
    this._values = [];
    this._startIndex = opts.startIndex || 1;
}

function ascending (a, b) {
    return a - b;
}

function reduceValues (list, value, index) {
    list[value] = index + this._startIndex;
    return list;
}

LayerCache.prototype._findValue = function (value) {
    if (has(this._values, value)) {
        return this._values[value];
    }
    return false;
};

LayerCache.prototype.optimizeValues = function () {
    this._values = uniq(this._values).sort(ascending).reduce(reduceValues.bind(this), {});
};

LayerCache.prototype.addValue = function (value) {
    var parsedValue = parseInt(value, 10);
    // pass only valid values
    if (!parsedValue || parsedValue < 0) {
        return;
    }
    this._values.push(parsedValue);
};

LayerCache.prototype.getValue = function (value) {
    var parsedValue = parseInt(value, 10);
    return this._findValue(parsedValue) || value;
};

module.exports = LayerCache;
