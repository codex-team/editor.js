'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _vendors = require('vendors');

var _vendors2 = _interopRequireDefault(_vendors);

var _clone = require('./lib/clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = _postcss2.default.list;

var prefixes = _vendors2.default.map(function (v) {
    return '-' + v + '-';
});

function intersect(a, b, not) {
    return a.filter(function (c) {
        var index = ~b.indexOf(c);
        return not ? !index : index;
    });
}

var different = function different(a, b) {
    return intersect(a, b, true).concat(intersect(b, a, true));
};
var filterPrefixes = function filterPrefixes(selector) {
    return intersect(prefixes, selector);
};

function sameVendor(selectorsA, selectorsB) {
    var same = function same(selectors) {
        return selectors.map(filterPrefixes).join();
    };
    return same(selectorsA) === same(selectorsB);
}

var noVendor = function noVendor(selector) {
    return !filterPrefixes(selector).length;
};

function sameParent(ruleA, ruleB) {
    var hasParent = ruleA.parent && ruleB.parent;
    var sameType = hasParent && ruleA.parent.type === ruleB.parent.type;
    // If an at rule, ensure that the parameters are the same
    if (hasParent && ruleA.parent.type !== 'root' && ruleB.parent.type !== 'root') {
        sameType = sameType && ruleA.parent.params === ruleB.parent.params && ruleA.parent.name === ruleB.parent.name;
    }
    return hasParent ? sameType : true;
}

function canMerge(ruleA, ruleB) {
    var a = list.comma(ruleA.selector);
    var b = list.comma(ruleB.selector);

    var parent = sameParent(ruleA, ruleB);
    var name = ruleA.parent.name;

    if (parent && name && ~name.indexOf('keyframes')) {
        return false;
    }
    return parent && (a.concat(b).every(noVendor) || sameVendor(a, b));
}

var getDecls = function getDecls(rule) {
    return rule.nodes ? rule.nodes.map(String) : [];
};
var joinSelectors = function joinSelectors() {
    for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
        rules[_key] = arguments[_key];
    }

    return rules.map(function (s) {
        return s.selector;
    }).join();
};

function ruleLength() {
    for (var _len2 = arguments.length, rules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        rules[_key2] = arguments[_key2];
    }

    return rules.map(function (r) {
        return r.nodes.length ? String(r) : '';
    }).join('').length;
}

function splitProp(prop) {
    var parts = prop.split('-');
    var base = void 0,
        rest = void 0;
    // Treat vendor prefixed properties as if they were unprefixed;
    // moving them when combined with non-prefixed properties can
    // cause issues. e.g. moving -webkit-background-clip when there
    // is a background shorthand definition.
    if (prop[0] === '-') {
        base = parts[2];
        rest = parts.slice(3);
    } else {
        base = parts[0];
        rest = parts.slice(1);
    }
    return [base, rest];
}

function isConflictingProp(propA, propB) {
    if (propA === propB) {
        return true;
    }
    var a = splitProp(propA);
    var b = splitProp(propB);
    return a[0] === b[0] && a[1].length !== b[1].length;
}

function hasConflicts(declProp, notMoved) {
    return notMoved.some(function (prop) {
        return isConflictingProp(prop, declProp);
    });
}

function partialMerge(first, second) {
    var _this = this;

    var intersection = intersect(getDecls(first), getDecls(second));
    if (!intersection.length) {
        return second;
    }
    var nextRule = second.next();
    if (nextRule && nextRule.type === 'rule' && canMerge(second, nextRule)) {
        var nextIntersection = intersect(getDecls(second), getDecls(nextRule));
        if (nextIntersection.length > intersection.length) {
            first = second;second = nextRule;intersection = nextIntersection;
        }
    }
    var recievingBlock = (0, _clone2.default)(second);
    recievingBlock.selector = joinSelectors(first, second);
    recievingBlock.nodes = [];
    second.parent.insertBefore(second, recievingBlock);
    var difference = different(getDecls(first), getDecls(second));
    var filterConflicts = function filterConflicts(decls, intersectn) {
        var willNotMove = [];
        return decls.reduce(function (willMove, decl) {
            var intersects = ~intersectn.indexOf(decl);
            var prop = decl.split(':')[0];
            var base = prop.split('-')[0];
            var canMove = difference.every(function (d) {
                return d.split(':')[0] !== base;
            });
            if (intersects && canMove && !hasConflicts(prop, willNotMove)) {
                willMove.push(decl);
            } else {
                willNotMove.push(prop);
            }
            return willMove;
        }, []);
    };
    intersection = filterConflicts(getDecls(first).reverse(), intersection);
    intersection = filterConflicts(getDecls(second), intersection);
    var firstClone = (0, _clone2.default)(first);
    var secondClone = (0, _clone2.default)(second);
    var moveDecl = function moveDecl(callback) {
        return function (decl) {
            if (~intersection.indexOf(String(decl))) {
                callback.call(_this, decl);
            }
        };
    };
    firstClone.walkDecls(moveDecl(function (decl) {
        decl.remove();
        recievingBlock.append(decl);
    }));
    secondClone.walkDecls(moveDecl(function (decl) {
        return decl.remove();
    }));
    var merged = ruleLength(firstClone, recievingBlock, secondClone);
    var original = ruleLength(first, second);
    if (merged < original) {
        first.replaceWith(firstClone);
        second.replaceWith(secondClone);
        [firstClone, recievingBlock, secondClone].forEach(function (r) {
            if (!r.nodes.length) {
                r.remove();
            }
        });
        if (!secondClone.parent) {
            return recievingBlock;
        }
        return secondClone;
    } else {
        recievingBlock.remove();
        return second;
    }
}

function selectorMerger() {
    var cache = null;
    return function (rule) {
        // Prime the cache with the first rule, or alternately ensure that it is
        // safe to merge both declarations before continuing
        if (!cache || !canMerge(rule, cache)) {
            cache = rule;
            return;
        }
        // Ensure that we don't deduplicate the same rule; this is sometimes
        // caused by a partial merge
        if (cache === rule) {
            cache = rule;
            return;
        }
        // Merge when declarations are exactly equal
        // e.g. h1 { color: red } h2 { color: red }
        if (getDecls(rule).join(';') === getDecls(cache).join(';')) {
            rule.selector = joinSelectors(cache, rule);
            cache.remove();
            cache = rule;
            return;
        }
        // Merge when both selectors are exactly equal
        // e.g. a { color: blue } a { font-weight: bold }
        if (cache.selector === rule.selector) {
            var _ret = function () {
                var cached = getDecls(cache);
                rule.walk(function (decl) {
                    if (~cached.indexOf(String(decl))) {
                        return decl.remove();
                    }
                    decl.moveTo(cache);
                });
                rule.remove();
                return {
                    v: void 0
                };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        // Partial merge: check if the rule contains a subset of the last; if
        // so create a joined selector with the subset, if smaller.
        cache = partialMerge(cache, rule);
    };
}

exports.default = _postcss2.default.plugin('postcss-merge-rules', function () {
    return function (css) {
        return css.walkRules(selectorMerger());
    };
});
module.exports = exports['default'];