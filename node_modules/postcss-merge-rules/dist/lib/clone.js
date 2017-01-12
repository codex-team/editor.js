'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var clone = function clone(obj, parent) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) {
        return obj;
    }
    var cloned = new obj.constructor();
    for (var i in obj) {
        if (!{}.hasOwnProperty.call(obj, i)) {
            continue;
        }
        var value = obj[i];
        if (i === 'parent' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            if (parent) {
                cloned[i] = parent;
            }
        } else if (i === 'source') {
            cloned[i] = value;
        } else if (value instanceof Array) {
            cloned[i] = value.map(function (j) {
                return clone(j, cloned);
            });
        } else {
            cloned[i] = clone(value, cloned);
        }
    }
    return cloned;
};

exports.default = clone;
module.exports = exports['default'];