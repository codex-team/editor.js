/**
 * Codex Editor toolbox
 *
 * All tools be able to appended here
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function () {
  let toolbox = {};

  let editor = this;

  toolbox.opened = false;
  toolbox.openedOnBlock = null;

    /** Shows toolbox */
  toolbox.open = function () {
        /** Close setting if toolbox is opened */
    if (editor.modules.toolbar.settings.opened) {
      editor.modules.toolbar.settings.close();
    }

        /** Add 'toolbar-opened' class for current block **/
    toolbox.openedOnBlock = editor.modules.content.currentNode;
    toolbox.openedOnBlock.classList.add('toolbar-opened');

        /** display toolbox */
    editor.nodes.toolbox.classList.add('opened');

        /** Animate plus button */
    editor.nodes.plusButton.classList.add('clicked');

        /** toolbox state */
    editor.modules.toolbar.toolbox.opened = true;
  };

    /** Closes toolbox */
  toolbox.close = function () {
        /** Remove 'toolbar-opened' class from current block **/
    if (toolbox.openedOnBlock) toolbox.openedOnBlock.classList.remove('toolbar-opened');
    toolbox.openedOnBlock = null;

        /** Makes toolbox disappear */
    editor.nodes.toolbox.classList.remove('opened');

        /** Rotate plus button */
    editor.nodes.plusButton.classList.remove('clicked');

        /** toolbox state */
    editor.modules.toolbar.toolbox.opened = false;

    editor.modules.toolbar.current = null;
  };

  toolbox.leaf = function () {
    let currentTool = editor.modules.toolbar.current,
        tools       = Object.keys(editor.tools),
        barButtons  = editor.nodes.toolbarButtons,
        nextToolIndex = 0,
        toolToSelect,
        visibleTool,
        tool;

    if ( !currentTool ) {
            /** Get first tool from object*/
      for(tool in editor.tools) {
        if (editor.tools[tool].displayInToolbox) {
          break;
        }

        nextToolIndex ++;
      }
    } else {
      nextToolIndex = (tools.indexOf(currentTool) + 1) % tools.length;
      visibleTool = tools[nextToolIndex];

      while (!editor.tools[visibleTool].displayInToolbox) {
        nextToolIndex = (nextToolIndex + 1) % tools.length;
        visibleTool = tools[nextToolIndex];
      }
    }

    toolToSelect = tools[nextToolIndex];

    for ( var button in barButtons ) {
      barButtons[button].classList.remove('selected');
    }

    barButtons[toolToSelect].classList.add('selected');
    editor.modules.toolbar.current = toolToSelect;
  };

    /**
     * Transforming selected node type into selected toolbar element type
     * @param {event} event
     */
  toolbox.toolClicked = function (event) {
        /**
         * UNREPLACEBLE_TOOLS this types of tools are forbidden to replace even they are empty
         */
    var UNREPLACEBLE_TOOLS = ['image', 'link', 'list', 'instagram', 'twitter', 'embed'],
        tool               = editor.tools[editor.modules.toolbar.current],
        workingNode        = editor.modules.content.currentNode,
        currentInputIndex  = editor.modules.caret.inputIndex,
        newBlockContent,
        appendCallback,
        blockData;

        /** Make block from plugin */
    newBlockContent = editor.modules.renderer.makeBlockFromData({type: tool.type});

        /** information about block */
    blockData = {
      block     : newBlockContent,
      type      : tool.type,
      stretched : false
    };

    if (
            workingNode &&
            UNREPLACEBLE_TOOLS.indexOf(workingNode.dataset.tool) === -1 &&
            workingNode.textContent.trim() === ''
        ) {
            /** Replace current block */
      editor.modules.content.switchBlock(workingNode, newBlockContent, tool.type);
    } else {
            /** Insert new Block from plugin */
      editor.modules.content.insertBlock(blockData);

            /** increase input index */
      currentInputIndex++;
    }

        /** Fire tool append callback  */
    appendCallback = tool.appendCallback;

    if (appendCallback && typeof appendCallback == 'function') {
      appendCallback.call(event);
    }

    window.setTimeout(function () {
            /** Set caret to current block */
      editor.modules.caret.setToBlock(currentInputIndex);
    }, 10);


        /**
         * Changing current Node
         */
    editor.modules.content.workingNodeChanged();

        /**
         * Move toolbar when node is changed
         */
    editor.modules.toolbar.move();
  };

  return toolbox;
});
