/**
 * Codex Editor Parser Module
 *
 * @author Codex Team
 * @version 1.1
 */

module.exports = (function (parser) {
  let editor = codex.editor;

  /** inserting text */
  parser.insertPastedContent = function (blockType, tag) {
    editor.content.insertBlock({
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
    return node.nodeType == editor.core.nodeTypes.TAG &&
            node.classList.contains(editor.ui.className.BLOCK_CLASSNAME);
  };

  return parser;
})({});
