'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

function dedupe(root) {
    root.each(function (node) {
        if (node.nodes) {
            dedupe(node);
        }
    });

    if (root.nodes.length < 2) {
        return;
    }

    var toRemove = [];
    var map = {};

    root.each(function (node) {
        if (node.type === "comment") {
            return;
        }

        var str = node.toString();
        var existing = map[str];
        if (existing) {
            toRemove.push(existing);
        }
        map[str] = node;
    });

    while (toRemove.length > 0) {
        toRemove.pop().remove();
    }
}

exports.default = (0, _postcss.plugin)('postcss-discard-duplicates', function () {
    return dedupe;
});
module.exports = exports['default'];