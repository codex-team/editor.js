"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _hoist = require("./hoist");

var _emit = require("./emit");

var _util = require("./util");

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMarkInfo = require("private").makeAccessor(); /**
                                                      * Copyright (c) 2014, Facebook, Inc.
                                                      * All rights reserved.
                                                      *
                                                      * This source code is licensed under the BSD-style license found in the
                                                      * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
                                                      * additional grant of patent rights can be found in the PATENTS file in
                                                      * the same directory.
                                                      */

exports.visitor = {
  Function: {
    exit: function exit(path, state) {
      var node = path.node;

      if (node.generator) {
        if (node.async) {
          // Async generator
          if (state.opts.asyncGenerators === false) return;
        } else {
          // Plain generator
          if (state.opts.generators === false) return;
        }
      } else if (node.async) {
        // Async function
        if (state.opts.async === false) return;
      } else {
        // Not a generator or async function.
        return;
      }

      var contextId = path.scope.generateUidIdentifier("context");
      var argsId = path.scope.generateUidIdentifier("args");

      path.ensureBlock();
      var bodyBlockPath = path.get("body");

      if (node.async) {
        bodyBlockPath.traverse(awaitVisitor);
      }

      bodyBlockPath.traverse(functionSentVisitor, {
        context: contextId
      });

      var outerBody = [];
      var innerBody = [];

      bodyBlockPath.get("body").forEach(function (childPath) {
        var node = childPath.node;
        if (t.isExpressionStatement(node) && t.isStringLiteral(node.expression)) {
          // Babylon represents directives like "use strict" as elements
          // of a bodyBlockPath.node.directives array, but they could just
          // as easily be represented (by other parsers) as traditional
          // string-literal-valued expression statements, so we need to
          // handle that here. (#248)
          outerBody.push(node);
        } else if (node && node._blockHoist != null) {
          outerBody.push(node);
        } else {
          innerBody.push(node);
        }
      });

      if (outerBody.length > 0) {
        // Only replace the inner body if we actually hoisted any statements
        // to the outer body.
        bodyBlockPath.node.body = innerBody;
      }

      var outerFnExpr = getOuterFnExpr(path);
      // Note that getOuterFnExpr has the side-effect of ensuring that the
      // function has a name (so node.id will always be an Identifier), even
      // if a temporary name has to be synthesized.
      t.assertIdentifier(node.id);
      var innerFnId = t.identifier(node.id.name + "$");

      // Turn all declarations into vars, and replace the original
      // declarations with equivalent assignment expressions.
      var vars = (0, _hoist.hoist)(path);

      var didRenameArguments = renameArguments(path, argsId);
      if (didRenameArguments) {
        vars = vars || t.variableDeclaration("var", []);
        vars.declarations.push(t.variableDeclarator(argsId, t.identifier("arguments")));
      }

      var emitter = new _emit.Emitter(contextId);
      emitter.explode(path.get("body"));

      if (vars && vars.declarations.length > 0) {
        outerBody.push(vars);
      }

      var wrapArgs = [emitter.getContextFunction(innerFnId),
      // Async functions that are not generators don't care about the
      // outer function because they don't need it to be marked and don't
      // inherit from its .prototype.
      node.generator ? outerFnExpr : t.nullLiteral(), t.thisExpression()];

      var tryLocsList = emitter.getTryLocsList();
      if (tryLocsList) {
        wrapArgs.push(tryLocsList);
      }

      var wrapCall = t.callExpression(util.runtimeProperty(node.async ? "async" : "wrap"), wrapArgs);

      outerBody.push(t.returnStatement(wrapCall));
      node.body = t.blockStatement(outerBody);

      var oldDirectives = bodyBlockPath.node.directives;
      if (oldDirectives) {
        // Babylon represents directives like "use strict" as elements of
        // a bodyBlockPath.node.directives array. (#248)
        node.body.directives = oldDirectives;
      }

      var wasGeneratorFunction = node.generator;
      if (wasGeneratorFunction) {
        node.generator = false;
      }

      if (node.async) {
        node.async = false;
      }

      if (wasGeneratorFunction && t.isExpression(node)) {
        path.replaceWith(t.callExpression(util.runtimeProperty("mark"), [node]));
      }

      // Generators are processed in 'exit' handlers so that regenerator only has to run on
      // an ES5 AST, but that means traversal will not pick up newly inserted references
      // to things like 'regeneratorRuntime'. To avoid this, we explicitly requeue.
      path.requeue();
    }
  }
};

// Given a NodePath for a Function, return an Expression node that can be
// used to refer reliably to the function object from inside the function.
// This expression is essentially a replacement for arguments.callee, with
// the key advantage that it works in strict mode.
function getOuterFnExpr(funPath) {
  var node = funPath.node;
  t.assertFunction(node);

  if (!node.id) {
    // Default-exported function declarations, and function expressions may not
    // have a name to reference, so we explicitly add one.
    node.id = funPath.scope.parent.generateUidIdentifier("callee");
  }

  if (node.generator && // Non-generator functions don't need to be marked.
  t.isFunctionDeclaration(node)) {
    var pp = funPath.findParent(function (path) {
      return path.isProgram() || path.isBlockStatement();
    });

    if (!pp) {
      return node.id;
    }

    var markDecl = getRuntimeMarkDecl(pp);
    var markedArray = markDecl.declarations[0].id;
    var funDeclIdArray = markDecl.declarations[0].init.callee.object;
    t.assertArrayExpression(funDeclIdArray);

    var index = funDeclIdArray.elements.length;
    funDeclIdArray.elements.push(node.id);

    return t.memberExpression(markedArray, t.numericLiteral(index), true);
  }

  return node.id;
}

function getRuntimeMarkDecl(blockPath) {
  var block = blockPath.node;
  _assert2.default.ok(Array.isArray(block.body));

  var info = getMarkInfo(block);
  if (info.decl) {
    return info.decl;
  }

  info.decl = t.variableDeclaration("var", [t.variableDeclarator(blockPath.scope.generateUidIdentifier("marked"), t.callExpression(t.memberExpression(t.arrayExpression([]), t.identifier("map"), false), [util.runtimeProperty("mark")]))]);

  blockPath.unshiftContainer("body", info.decl);

  return info.decl;
}

function renameArguments(funcPath, argsId) {
  var state = {
    didRenameArguments: false,
    argsId: argsId
  };

  funcPath.traverse(argumentsVisitor, state);

  // If the traversal replaced any arguments references, then we need to
  // alias the outer function's arguments binding (be it the implicit
  // arguments object or some other parameter or variable) to the variable
  // named by argsId.
  return state.didRenameArguments;
}

var argumentsVisitor = {
  "FunctionExpression|FunctionDeclaration": function FunctionExpressionFunctionDeclaration(path) {
    path.skip();
  },

  Identifier: function Identifier(path, state) {
    if (path.node.name === "arguments" && util.isReference(path)) {
      path.replaceWith(state.argsId);
      state.didRenameArguments = true;
    }
  }
};

var functionSentVisitor = {
  MetaProperty: function MetaProperty(path) {
    var node = path.node;


    if (node.meta.name === "function" && node.property.name === "sent") {
      path.replaceWith(t.memberExpression(this.context, t.identifier("_sent")));
    }
  }
};

var awaitVisitor = {
  Function: function Function(path) {
    path.skip(); // Don't descend into nested function scopes.
  },

  AwaitExpression: function AwaitExpression(path) {
    // Convert await expressions to yield expressions.
    var argument = path.node.argument;

    // Transforming `await x` to `yield regeneratorRuntime.awrap(x)`
    // causes the argument to be wrapped in such a way that the runtime
    // can distinguish between awaited and merely yielded values.
    path.replaceWith(t.yieldExpression(t.callExpression(util.runtimeProperty("awrap"), [argument]), false));
  }
};