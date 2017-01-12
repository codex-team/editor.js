var postcss = require('postcss');
var valueParser = require('postcss-value-parser');
var stringify = valueParser.stringify;
var sort = require('alphanum-sort');
var uniqs = require('uniqs');

function split(nodes, div) {
    var result = [];
    var i, max, node;
    var last = '';

    for (i = 0, max = nodes.length; i < max; i += 1) {
        node = nodes[i];
        if (node.type === 'div' && node.value === div) {
            result.push(last);
            last = '';
        } else {
            last += stringify(node);
        }
    }

    result.push(last);

    return result;
}

function removeNode(node) {
    node.value = '';
    node.type = 'word';
}

module.exports = postcss.plugin('postcss-minify-params', function () {
    return function (css) {
        css.walkAtRules(function (rule) {
            if (!rule.params) {
                return;
            }

            var params = valueParser(rule.params);

            params.walk(function (node, index) {
                if (node.type === 'div' || node.type === 'function') {
                    node.before = node.after = '';
                } else if (node.type === 'space') {
                    node.value = ' ';
                } else if (node.type === 'word') {
                    if (node.value === 'all' && rule.name === 'media') {
                        var nextSpace = params.nodes[index + 1];
                        var nextWord = params.nodes[index + 2];
                        var secondSpace = params.nodes[index + 3];
                        if (nextWord && nextWord.value === 'and') {
                            removeNode(nextWord);
                            removeNode(nextSpace);
                            if (secondSpace) {
                                removeNode(secondSpace);
                            }
                        }
                        removeNode(node);
                    }
                }
            }, true);

            rule.params = sort(uniqs(split(params.nodes, ',')), {
                insensitive: true
            }).join();

            if (!rule.params.length) {
                rule.raws.afterName = '';
            }
        });
    };
});
