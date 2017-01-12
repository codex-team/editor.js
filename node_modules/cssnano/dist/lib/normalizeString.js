'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var postcss = require('postcss');
var valueParser = require('postcss-value-parser');

/*
 * Constants (parser usage)
 */

var SINGLE_QUOTE = 39;
var DOUBLE_QUOTE = 34;
var BACKSLASH = 92;
var NEWLINE = 10;
var SPACE = 32;
var FEED = 12;
var TAB = 9;
var CR = 13;

var WORD_END = /[ \n\t\r\f'"\\]/g;

/*
 * Constants (node type strings)
 */

var C_STRING = 'string';
var C_ESCAPED_SINGLE_QUOTE = 'escapedSingleQuote';
var C_ESCAPED_DOUBLE_QUOTE = 'escapedDoubleQuote';
var C_SINGLE_QUOTE = 'singleQuote';
var C_DOUBLE_QUOTE = 'doubleQuote';
var C_NEWLINE = 'newline';
var C_SINGLE = 'single';

/*
 * Literals
 */

var L_SINGLE_QUOTE = '\'';
var L_DOUBLE_QUOTE = '"';
var L_NEWLINE = '\\\n';

/*
 * Parser nodes
 */

var T_ESCAPED_SINGLE_QUOTE = { type: C_ESCAPED_SINGLE_QUOTE, value: '\\\'' };
var T_ESCAPED_DOUBLE_QUOTE = { type: C_ESCAPED_DOUBLE_QUOTE, value: '\\"' };
var T_SINGLE_QUOTE = { type: C_SINGLE_QUOTE, value: L_SINGLE_QUOTE };
var T_DOUBLE_QUOTE = { type: C_DOUBLE_QUOTE, value: L_DOUBLE_QUOTE };
var T_NEWLINE = { type: C_NEWLINE, value: L_NEWLINE };

function stringify(ast) {
    return ast.nodes.reduce(function (str, _ref) {
        var value = _ref.value;

        // Collapse multiple line strings automatically
        if (value === L_NEWLINE) {
            return str;
        }
        return str + value;
    }, '');
}

function parse(str) {
    var code = void 0,
        next = void 0,
        value = void 0;
    var pos = 0;
    var len = str.length;

    var ast = {
        nodes: [],
        types: {
            escapedSingleQuote: 0,
            escapedDoubleQuote: 0,
            singleQuote: 0,
            doubleQuote: 0
        },
        quotes: false
    };

    while (pos < len) {
        code = str.charCodeAt(pos);
        switch (code) {
            case SPACE:
            case TAB:
            case CR:
            case FEED:
                next = pos;
                do {
                    next += 1;
                    code = str.charCodeAt(next);
                } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);

                ast.nodes.push({
                    type: 'space',
                    value: str.slice(pos, next)
                });
                pos = next - 1;
                break;
            case SINGLE_QUOTE:
                ast.nodes.push(T_SINGLE_QUOTE);
                ast.types[C_SINGLE_QUOTE]++;
                ast.quotes = true;
                break;
            case DOUBLE_QUOTE:
                ast.nodes.push(T_DOUBLE_QUOTE);
                ast.types[C_DOUBLE_QUOTE]++;
                ast.quotes = true;
                break;
            case BACKSLASH:
                next = pos + 1;
                if (str.charCodeAt(next) === SINGLE_QUOTE) {
                    ast.nodes.push(T_ESCAPED_SINGLE_QUOTE);
                    ast.types[C_ESCAPED_SINGLE_QUOTE]++;
                    ast.quotes = true;
                    pos = next;
                    break;
                } else if (str.charCodeAt(next) === DOUBLE_QUOTE) {
                    ast.nodes.push(T_ESCAPED_DOUBLE_QUOTE);
                    ast.types[C_ESCAPED_DOUBLE_QUOTE]++;
                    ast.quotes = true;
                    pos = next;
                    break;
                } else if (str.charCodeAt(next) === NEWLINE) {
                    ast.nodes.push(T_NEWLINE);
                    pos = next;
                    break;
                }
            /*
             * We need to fall through here to handle the token as
             * a whole word. The missing 'break' is intentional.
             */
            default:
                WORD_END.lastIndex = pos + 1;
                WORD_END.test(str);

                if (WORD_END.lastIndex === 0) {
                    next = len - 1;
                } else {
                    next = WORD_END.lastIndex - 2;
                }

                value = str.slice(pos, next + 1);

                ast.nodes.push({
                    type: C_STRING,
                    value: value
                });

                pos = next;
        }
        pos++;
    }

    return ast;
}

function changeWrappingQuotes(node, ast) {
    var types = ast.types;

    if (types[C_SINGLE_QUOTE] || types[C_DOUBLE_QUOTE]) {
        return;
    }

    if (node.quote === L_SINGLE_QUOTE && types[C_ESCAPED_SINGLE_QUOTE] > 0 && !types[C_ESCAPED_DOUBLE_QUOTE]) {
        node.quote = L_DOUBLE_QUOTE;
    }

    if (node.quote === L_DOUBLE_QUOTE && types[C_ESCAPED_DOUBLE_QUOTE] > 0 && !types[C_ESCAPED_SINGLE_QUOTE]) {
        node.quote = L_SINGLE_QUOTE;
    }

    ast.nodes = ast.nodes.reduce(function (newAst, child) {
        if (child.type === C_ESCAPED_DOUBLE_QUOTE && node.quote === L_SINGLE_QUOTE) {
            return [].concat(newAst, [T_DOUBLE_QUOTE]);
        }
        if (child.type === C_ESCAPED_SINGLE_QUOTE && node.quote === L_DOUBLE_QUOTE) {
            return [].concat(newAst, [T_SINGLE_QUOTE]);
        }
        return [].concat(newAst, [child]);
    }, []);
}

function normalize(value, preferredQuote) {
    if (!value || !value.length) {
        return value;
    }
    return valueParser(value).walk(function (child) {
        if (child.type !== C_STRING) {
            return;
        }
        var ast = parse(child.value);
        if (ast.quotes) {
            changeWrappingQuotes(child, ast);
        } else if (preferredQuote === C_SINGLE) {
            child.quote = L_SINGLE_QUOTE;
        } else {
            child.quote = L_DOUBLE_QUOTE;
        }
        child.value = stringify(ast);
    }).toString();
}

exports.default = postcss.plugin('cssnano-normalize-string', function (opts) {
    var _preferredQuote$opts = _extends({
        preferredQuote: 'double'
    }, opts),
        preferredQuote = _preferredQuote$opts.preferredQuote;

    return function (css) {
        css.walk(function (node) {
            if (node.type === 'rule') {
                node.selector = normalize(node.selector, preferredQuote);
            }
            if (node.type === 'decl') {
                node.value = normalize(node.value, preferredQuote);
            }
            if (node.type === 'atrule') {
                node.params = normalize(node.params, preferredQuote);
            }
        });
    };
});
module.exports = exports['default'];