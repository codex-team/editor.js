/**
 * Codex Editor Parser Module
 *
 * @author Codex Team
 * @version 1.1
 */

var parser = (function(parser) {

    /** inserting text */
    parser.insertPastedContent = function(blockType, tag) {

        codex.content.insertBlock({
            type :  blockType.type,
            block : blockType.render({
                text : tag.innerHTML
            })
        });

    };

    /**
     * Check DOM node for display style: separated block or child-view
     */
    parser.isFirstLevelBlock = function (node) {

        return node.nodeType == cEditor.core.nodeTypes.TAG &&
            node.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME);

    };

    return parser;

})({});

module.exports = parser;
