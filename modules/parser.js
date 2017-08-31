/**
 * Codex Editor Parser Module
 *
 * @author Codex Team
 * @version 1.1
 */

module.exports = (function () {

    let parser = {};

    let editor = this;

    /** inserting text */
    parser.insertPastedContent = function (blockType, tag) {

        editor.modules.content.insertBlock({
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

        return node.nodeType == editor.modules.core.nodeTypes.TAG &&
            node.classList.contains(editor.modules.ui.className.BLOCK_CLASSNAME);

    };

    return parser;

});
