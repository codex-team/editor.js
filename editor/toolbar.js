/**
 * Toolbar
 *
 * @author Codex team
 * @version 1.0.0
 */

var toolbar = (function() {

    /**
     * Margin between focused node and toolbar
     */
    var defaultToolbarHeight = 49;

    var defaultOffset = 34;

    var opened = false;

    var current = null;

    /**
     * @protected
     *
     */
    var open = function (){

        var current             = cEditor.content.currentNode,
            removeBlockButton   = cEditor.nodes.removeBlockButton;

        /** Set trash state before we open the block */
        if (current.classList.contains('removing-request')) {
            removeBlockButton.classList.add('trash-active');
        } else {
            removeBlockButton.classList.remove('trash-active');
        }

        if (this.opened) {
            return;
        }

        cEditor.nodes.toolbar.classList.add('opened');
        this.opened = true;

    };

    /**
     * @protected
     *
     */
    var close = function(){

        cEditor.nodes.toolbar.classList.remove('opened');

        this.opened  = false;
        this.current = null;
        for (var button in cEditor.nodes.toolbarButtons){
            cEditor.nodes.toolbarButtons[button].classList.remove('selected');
        }

        /** Close toolbox when toolbar is not displayed */
        cEditor.toolbar.toolbox.close();

    };

    var toggle = function(){

        if ( !this.opened ){

            this.open();

        } else {

            this.close();

        }
    };

    /**
     * @protected
     *
     * Panel which wrappes all User defined plugins (tools)
     */
    var toolbox = {

        opened : false,

        /** Shows toolbox */
        open : function() {

            /** Close setting if toolbox is opened */
            if (cEditor.toolbar.settings.opened) {
                cEditor.toolbar.settings.close();
            }

            /** display toolbox */
            cEditor.nodes.toolbox.classList.add('opened');

            /** Animate plus button */
            cEditor.nodes.plusButton.classList.add('ce_redactor_plusButton--clicked');

            /** toolbox state */
            cEditor.toolbar.toolbox.opened = true;

        },

        /** Closes toolbox */
        close : function() {

            /** Makes toolbox disapear */
            cEditor.nodes.toolbox.classList.remove('opened');

            /** Rotate plus button */
            cEditor.nodes.plusButton.classList.remove('ce_redactor_plusButton--clicked');

            /** toolbox state */
            cEditor.toolbar.toolbox.opened = false;

        },

    };

    /**
     * @protected
     *
     */
    var leaf = function(){

        var currentTool = this.current,
            tools       = Object.keys(cEditor.tools),
            barButtons  = cEditor.nodes.toolbarButtons,
            nextToolIndex,
            toolToSelect;

        if ( !currentTool ) {

            /** Get first tool from object*/
            for (toolToSelect in barButtons) break;

        } else {

            nextToolIndex = tools.indexOf(currentTool) + 1;

            if ( nextToolIndex == tools.length) nextToolIndex = 0;

            toolToSelect = tools[nextToolIndex];

        }

        for (var button in barButtons) barButtons[button].classList.remove('selected');

        barButtons[toolToSelect].classList.add('selected');

        this.current = toolToSelect;

    };

    /**
     * @protected
     *
     * Transforming selected node type into selected toolbar element type
     * @param {event} event
     */
    var toolClicked = function() {

        /**
         * UNREPLACEBLE_TOOLS this types of tools are forbidden to replace even they are empty
         */
        var UNREPLACEBLE_TOOLS = ['image', 'link', 'list'],
            tool             = cEditor.tools[cEditor.toolbar.current],
            workingNode      = cEditor.content.currentNode,
            currentInputIndex = cEditor.caret.inputIndex,
            newBlockContent,
            appendCallback,
            blockData;

        /** Make block from plugin */
        newBlockContent = tool.make();

        /** information about block */
        blockData = {
            block     : newBlockContent,
            type      : tool.type,
            stretched : false
        };

        if (workingNode
            && UNREPLACEBLE_TOOLS.indexOf(workingNode.dataset.type) === -1
            && workingNode.textContent.trim() === ''
        ) {

            /** Replace current block */
            cEditor.content.switchBlock(workingNode, newBlockContent, tool.type)

        } else {

            /** Insert new Block from plugin */
            cEditor.content.insertBlock(blockData);

            /** increase input index */
            currentInputIndex++;

        }

        /** Fire tool append callback  */
        var appendCallback = tool.appendCallback;

        if (appendCallback && typeof appendCallback == 'function') {
            appendCallback.call(event);
        }

        setTimeout(function() {

            /** Set caret to current block */
            cEditor.caret.setToBlock(currentInputIndex);

        }, 10);


        /**
         * Changing current Node
         */
        cEditor.content.workingNodeChanged();

        /**
         * Move toolbar when node is changed
         */
        cEditor.toolbar.move();
    };

    /**
     * @protected
     *
     * Moving toolbar to the specified node
     */
    var move = function() {

        /** Close Toolbox when we move toolbar */
        cEditor.toolbar.toolbox.close();

        if (!cEditor.content.currentNode) {
            return;
        }

        var toolbarHeight = cEditor.nodes.toolbar.clientHeight || cEditor.toolbar.defaultToolbarHeight,
            newYCoordinate = cEditor.content.currentNode.offsetTop - (cEditor.toolbar.defaultToolbarHeight / 2) + cEditor.toolbar.defaultOffset;

        cEditor.nodes.toolbar.style.transform = "translateY(" + newYCoordinate + "px)";

    };

    /**
     * @protected
     *
     * Block settings methods
     */
    var settings = {

        opened : false,

        /**
         * Append and open settings
         */
        open : function(toolType){

            /**
             * Append settings content
             * It's stored in tool.settings
             */
            if (!cEditor.tools[toolType] || !cEditor.core.isDomNode(cEditor.tools[toolType].settings) ) {

                cEditor.core.log('Wrong tool type', 'warn');
                cEditor.nodes.blockSettings.innerHTML = `Плагин «${toolType}» не имеет настроек`;

            } else {

                cEditor.nodes.blockSettings.appendChild(cEditor.tools[toolType].settings);

            }

            cEditor.nodes.blockSettings.classList.add('opened');
            this.opened = true;

        },

        /**
         * Close and clear settings
         */
        close : function(){

            cEditor.nodes.blockSettings.classList.remove('opened');
            cEditor.nodes.blockSettings.innerHTML = '';

            this.opened = false;

        },

        /**
         * @param {string} toolType - plugin type
         */
        toggle : function( toolType ){

            if ( !this.opened ){

                this.open(toolType);

            } else {

                this.close();

            }

        },

    };

    return {
        defaultToolbarHeight : defaultToolbarHeight,
        defaultOffset        : defaultOffset,
        opened               : opened,
        current              : current,
        open                 : open,
        close                : close,
        leaf                 : leaf,
        toggle               : toggle,
        toolbox              : toolbox,
        toolClicked          : toolClicked,
        move                 : move,
        settings             : settings
    }

})();

module.exports = toolbar;