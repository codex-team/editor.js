/**
 * Codex Editor toolbox
 *
 * All tools be able to appended here
 *
 * @author Codex Team
 * @version 1.0
 */
 
var toolbox = (function(toolbox) {

    toolbox.init = function () {

        require('./toolbar');

    };

    toolbox.opened = false;

    /** Shows toolbox */
    toolbox.open = function() {

        /** Close setting if toolbox is opened */
        if (codex.toolbar.settings.opened) {

            codex.toolbar.settings.close();

        }

        /** display toolbox */
        codex.nodes.toolbox.classList.add('opened');

        /** Animate plus button */
        codex.nodes.plusButton.classList.add('clicked');

        /** toolbox state */
        codex.toolbar.toolbox.opened = true;

    };

    /** Closes toolbox */
    toolbox.close = function() {

        /** Makes toolbox disapear */
        codex.nodes.toolbox.classList.remove('opened');

        /** Rotate plus button */
        codex.nodes.plusButton.classList.remove('clicked');

        /** toolbox state */
        codex.toolbar.toolbox.opened = false;

    };

    toolbox.leaf = function(){

        var currentTool = codex.toolbar.current,
            tools       = Object.keys(codex.tools),
            barButtons  = codex.nodes.toolbarButtons,
            nextToolIndex,
            hiddenToolsAmount = 0,
            toolToSelect;

        /** Count toolbox hidden tools */
        for( var tool in codex.tools ) {

            if (!codex.tools[tool].displayInToolbox) {

                hiddenToolsAmount ++;

            }


        }

        if ( !currentTool ) {

            /** Get first tool from object*/
            for (toolToSelect in barButtons) break;

        } else {

            nextToolIndex = tools.indexOf(currentTool) + 1;

            var toolIsLastInToolbox = nextToolIndex == tools.length - (hiddenToolsAmount - 2);

            if ( toolIsLastInToolbox ) {

                nextToolIndex = 0;

                /** getting first displayed tool */
                for( var tool in codex.tools ) {

                    if (codex.tools[tool].displayInToolbox){

                        break;

                    }

                    nextToolIndex ++;
                }

            }

            toolToSelect = tools[nextToolIndex];

        }

        for (var button in barButtons) barButtons[button].classList.remove('selected');
        barButtons[toolToSelect].classList.add('selected');
        codex.toolbar.current = toolToSelect;

    };

    /**
     * Transforming selected node type into selected toolbar element type
     * @param {event} event
     */
    toolbox.toolClicked = function() {

        /**
         * UNREPLACEBLE_TOOLS this types of tools are forbidden to replace even they are empty
         */
        var UNREPLACEBLE_TOOLS = ['image', 'link', 'list', 'instagram', 'twitter'],
            tool               = codex.tools[codex.toolbar.current],
            workingNode        = codex.content.currentNode,
            currentInputIndex  = codex.caret.inputIndex,
            newBlockContent,
            appendCallback,
            blockData;

        /** Make block from plugin */
        newBlockContent = tool.render();

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
        ){

            /** Replace current block */
            codex.content.switchBlock(workingNode, newBlockContent, tool.type);

        } else {

            /** Insert new Block from plugin */
            codex.content.insertBlock(blockData);

            /** increase input index */
            currentInputIndex++;

        }

        /** Fire tool append callback  */
        appendCallback = tool.appendCallback;

        if (appendCallback && typeof appendCallback == 'function') {

            appendCallback.call(event);

        }

        setTimeout(function() {

            /** Set caret to current block */
            codex.caret.setToBlock(currentInputIndex);

        }, 10);


        /**
         * Changing current Node
         */
        codex.content.workingNodeChanged();

        /**
         * Move toolbar when node is changed
         */
        codex.toolbar.move();
    };

    return toolbox;

})({});

toolbox.init();

module.exports = toolbox;