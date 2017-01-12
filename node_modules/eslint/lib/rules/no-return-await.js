/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const message = "Redundant use of `await` on a return value.";

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary `return await`",
            category: "Best Practices",
            recommended: false // TODO: set to true
        },
        fixable: false,
        schema: [
        ]
    },

    create(context) {

        /**
        * Determines whether a thrown error from this node will be caught/handled within this function rather than immediately halting
        * this function. For example, a statement in a `try` block will always have an error handler. A statement in
        * a `catch` block will only have an error handler if there is also a `finally` block.
        * @param {ASTNode} node A node representing a location where an could be thrown
        * @returns {boolean} `true` if a thrown error will be caught/handled in this function
        */
        function hasErrorHandler(node) {
            let ancestor = node;

            while (!astUtils.isFunction(ancestor) && ancestor.type !== "Program") {
                if (ancestor.parent.type === "TryStatement" && (ancestor === ancestor.parent.block || ancestor === ancestor.parent.handler && ancestor.parent.finalizer)) {
                    return true;
                }
                ancestor = ancestor.parent;
            }
            return false;
        }

        return {
            ArrowFunctionExpression(node) {
                if (node.async && node.body.type === "AwaitExpression") {
                    const sourceCode = context.getSourceCode();
                    const loc = node.body.loc;

                    context.report({
                        node: sourceCode.getFirstToken(node.body),
                        loc,
                        message,
                    });
                }
            },
            ReturnStatement(node) {
                const argument = node.argument;

                if (argument && argument.type === "AwaitExpression" && !hasErrorHandler(node)) {
                    const sourceCode = context.getSourceCode();
                    const loc = argument.loc;

                    context.report({
                        node: sourceCode.getFirstToken(argument),
                        loc,
                        message,
                    });
                }
            },
        };
    }
};
