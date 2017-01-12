'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _alphanumSort = require('alphanum-sort');

var _alphanumSort2 = _interopRequireDefault(_alphanumSort);

var _has = require('has');

var _has2 = _interopRequireDefault(_has);

var _postcssSelectorParser = require('postcss-selector-parser');

var _postcssSelectorParser2 = _interopRequireDefault(_postcssSelectorParser);

var _unquote = require('./lib/unquote');

var _unquote2 = _interopRequireDefault(_unquote);

var _canUnquote = require('./lib/canUnquote');

var _canUnquote2 = _interopRequireDefault(_canUnquote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pseudoElements = ['::before', '::after', '::first-letter', '::first-line'];

function getParsed(selectors, callback) {
    return (0, _postcssSelectorParser2.default)(callback).process(selectors).result;
}

function attribute(selector) {
    if (selector.value) {
        // Join selectors that are split over new lines
        selector.value = selector.value.replace(/\\\n/g, '').trim();
        if ((0, _canUnquote2.default)(selector.value)) {
            selector.value = (0, _unquote2.default)(selector.value);
        }
        selector.operator = selector.operator.trim();
    }
    if (selector.raws && selector.raws.insensitive) {
        selector.raws.insensitive = '';
    }
    selector.attribute = selector.attribute.trim();
}

function combinator(selector) {
    var value = selector.value.trim();
    selector.value = value.length ? value : ' ';
}

function pseudo(selector) {
    var uniques = [];
    selector.walk(function (child) {
        if (child.type === 'selector') {
            var childStr = String(child);
            if (!~uniques.indexOf(childStr)) {
                uniques.push(childStr);
            } else {
                child.remove();
            }
        }
    });
    if (~pseudoElements.indexOf(selector.value)) {
        selector.value = selector.value.slice(1);
    }
}

var tagReplacements = {
    from: '0%',
    '100%': 'to'
};

function tag(selector) {
    var value = selector.value;

    if ((0, _has2.default)(tagReplacements, value)) {
        selector.value = tagReplacements[value];
    }
}

function universal(selector) {
    var next = selector.next();
    if (next && next.type !== 'combinator') {
        selector.remove();
    }
}

var reducers = {
    attribute: attribute,
    combinator: combinator,
    pseudo: pseudo,
    tag: tag,
    universal: universal
};

function optimise(rule) {
    var selector = rule.raws.selector && rule.raws.selector.raw || rule.selector;
    // If the selector ends with a ':' it is likely a part of a custom mixin,
    // so just pass through.
    if (selector[selector.length - 1] === ':') {
        return;
    }
    rule.selector = getParsed(selector, function (selectors) {
        selectors.nodes = (0, _alphanumSort2.default)(selectors.nodes, { insensitive: true });
        var uniqueSelectors = [];
        selectors.walk(function (sel) {
            var type = sel.type;
            // Trim whitespace around the value

            sel.spaces.before = sel.spaces.after = '';
            if ((0, _has2.default)(reducers, type)) {
                reducers[type](sel);
                return;
            }
            var toString = String(sel);
            if (type === 'selector' && sel.parent.type !== 'pseudo') {
                if (!~uniqueSelectors.indexOf(toString)) {
                    uniqueSelectors.push(toString);
                } else {
                    sel.remove();
                }
            }
        });
    });
}

exports.default = (0, _postcss.plugin)('postcss-minify-selectors', function () {
    return function (css) {
        return css.walkRules(optimise);
    };
});
module.exports = exports['default'];