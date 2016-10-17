/**
 * @author Codex Team
 * @version 1.0.1
 */

var content = (function(){

    var currentNode = null;

    /**
     * @private
     *
     * Synchronizes redactor with original textarea
     */
    var sync = function () {

        cEditor.core.log('syncing...');

        /**
         * Save redactor content to cEditor.state
         */
        cEditor.state.html = cEditor.nodes.redactor.innerHTML;

    };

    /**
     * @protected
     *
     * Appends background to the block
     */
    var markBlock = function() {

        cEditor.content.currentNode.classList.add(cEditor.ui.className.BLOCK_HIGHLIGHTED);
    };

    /**
     * @protected
     *
     * Clear background
     */
    var clearMark = function() {

        if (cEditor.content.currentNode) {
            cEditor.content.currentNode.classList.remove(cEditor.ui.className.BLOCK_HIGHLIGHTED);
        }

    };

    /**
     * @protected
     *
     * Finds first-level block
     * @param {Element} node - selected or clicked in redactors area node
     */
    var getFirstLevelBlock = function(node) {

        if (!cEditor.core.isDomNode(node)) {
            node = node.parentNode;
        }

        if (node === cEditor.nodes.redactor) {

            return null;

        } else {

            while(!node.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME)) {
                node = node.parentNode;
            }

            return node;
        }

    };

    /**
     * @protected
     *
     * Trigger this event when working node changed
     * @param {Element} targetNode - first-level of this node will be current
     * If targetNode is first-level then we set it as current else we look for parents to find first-level
     */
    var workingNodeChanged = function (targetNode) {

        /** Clear background from previous marked block before we change */
        cEditor.content.clearMark();

        if (!targetNode) {
            return;
        }

        this.currentNode = this.getFirstLevelBlock(targetNode);
    };

    /**
     * @protected
     *
     * Replaces one redactor block with another
     *
     * @param {Element} targetBlock - block to replace. Mostly currentNode.
     * @param {Element} newBlock
     * @param {string} newBlockType - type of new block; we need to store it to data-attribute
     *
     * [!] Function does not saves old block content.
     *     You can get it manually and pass with newBlock.innerHTML
     */
    var replaceBlock = function (targetBlock, newBlock, newBlockType) {

        if (!targetBlock || !newBlock || !newBlockType){
            cEditor.core.log('replaceBlock: missed params');
            return;
        }

        /** Store block type */
        newBlock.dataset.type = newBlockType;

        /** If target-block is not a frist-level block, then we iterate parents to find it */
        while(!targetBlock.classList.contains(cEditor.ui.className.BLOCK_CLASSNAME)) {
            targetBlock = targetBlock.parentNode;
        }

        /** Replacing */
        cEditor.nodes.redactor.replaceChild(newBlock, targetBlock);

        /**
         * Set new node as current
         */
        cEditor.content.workingNodeChanged(newBlock);

        /**
         * Add block handlers
         */
        cEditor.ui.addBlockHandlers(newBlock);

        /**
         * Save changes
         */
        cEditor.ui.saveInputs();

    };

    /**
     * @protected
     *
     * Inserts new block to redactor
     * Wrapps block into a DIV with BLOCK_CLASSNAME class
     */
    var insertBlock = function(blockData) {

        var workingBlock    = cEditor.content.currentNode,
            newBlockContent = blockData.block,
            blockType       = blockData.type,
            isStretched     = blockData.stretched;

        var newBlock = cEditor.content.composeNewBlock(newBlockContent, blockType, isStretched);

        if (workingBlock) {

            cEditor.core.insertAfter(workingBlock, newBlock);

        } else {

            /**
             * If redactor is empty, append as first child
             */
            cEditor.nodes.redactor.appendChild(newBlock);

        }

        /**
         * Block handler
         */
        cEditor.ui.addBlockHandlers(newBlock)

        /**
         * Set new node as current
         */
        cEditor.content.workingNodeChanged(newBlock)

        /**
         * Save changes
         */
        cEditor.ui.saveInputs();

    };

    /**
     * @protected
     *
     * Replaces blocks with saving content
     *
     * @param {Element} noteToReplace
     * @param {Element} newNode
     * @param {Element} blockType
     */
    var switchBlock = function(blockToReplace, newBlock, blockType){

        var newBlockComposed = cEditor.content.composeNewBlock(newBlock, blockType);

        /** Replacing */
        cEditor.content.replaceBlock(blockToReplace, newBlockComposed, blockType);

        /** Save new Inputs when block is changed */
        cEditor.ui.saveInputs();
    };


    /**
     * @private
     *
     * Iterates between child noted and looking for #text node on deepest level
     *
     * @param {Element} block - node where find
     * @param {int} postiton - starting postion
     *      Example: childNodex.length to find from the end
     *               or 0 to find from the start
     * @return {Text} block
     * @uses DFS
     */
    var getDeepestTextNodeFromPosition = function (block, position) {

        /**
         * Clear Block from empty and useless spaces with trim.
         * Such nodes we should remove
         */
        var index,
            blockChilds = block.childNodes;

        for(index = 0; index < blockChilds.length; index++)
        {
            var node = blockChilds[index];

            if (node.nodeType == cEditor.core.nodeTypes.TEXT) {

                text = node.textContent.trim();

                /** Text is empty. We should remove this child from node before we start DFS
                 * decrease the quantity of childs.
                 */
                if (text === '') {

                    block.removeChild(node);
                    position--;
                }
            }
        }

        if (block.childNodes.length === 0) {
            return document.createTextNode('');
        }

        /** Setting default position when we deleted all empty nodes */
        if ( position < 0 )
            position = 1;

        var looking_from_start = false;

        /** For looking from START */
        if (position === 0) {
            looking_from_start = true;
            position = 1;
        }

        while ( position ) {

            /** initial verticle of node. */
            if ( looking_from_start ) {
                block = block.childNodes[0];
            } else {
                block = block.childNodes[position - 1];
            }

            if ( block.nodeType == cEditor.core.nodeTypes.TAG ){

                position = block.childNodes.length;

            } else if (block.nodeType == cEditor.core.nodeTypes.TEXT ){

                position = 0;
            }

        }

        return block;
    };

    /**
     * @private
     *
     */
    var composeNewBlock = function (block, blockType, isStretched) {

        newBlock = cEditor.draw.block('DIV');

        newBlock.classList.add(cEditor.ui.className.BLOCK_CLASSNAME);

        if (isStretched) {
            newBlock.classList.add(cEditor.ui.className.BLOCK_STRETCHED);
        }
        newBlock.dataset.type = blockType;

        newBlock.appendChild(block);

        return newBlock;

    };

    /**
     * @protected
     *
     * Returns Range object of current selection
     */
    var getRange = function() {

        var selection = window.getSelection().getRangeAt(0);

        return selection;
    };

    /**
     * @private
     *
     * Divides block in two blocks (after and before caret)
     *
     * @param {Int} inputIndex - target input index
     */
    var splitBlock = function(inputIndex) {

        var selection      = window.getSelection(),
            anchorNode     = selection.anchorNode,
            anchorNodeText = anchorNode.textContent,
            caretOffset    = selection.anchorOffset,
            textBeforeCaret,
            textNodeBeforeCaret,
            textAfterCaret,
            textNodeAfterCaret;


        textBeforeCaret     = anchorNodeText.substring(0, caretOffset);
        textAfterCaret      = anchorNodeText.substring(caretOffset);

        textNodeBeforeCaret = document.createTextNode(textBeforeCaret);

        if (textAfterCaret) {
            textNodeAfterCaret  = document.createTextNode(textAfterCaret);
        }

        var previousChilds = [],
            nextChilds     = [],
            reachedCurrent = false;

        if (textNodeAfterCaret) {
            nextChilds.push(textNodeAfterCaret);
        }

        for ( var i = 0, child; !!(child = currentblock.childNodes[i]); i++) {

            if ( child != anchorNode ) {
                if ( !reachedCurrent ){
                    previousChilds.push(child);
                } else {
                    nextChilds.push(child);
                }
            } else {
                reachedCurrent = true;
            }

        }

        /** Clear current input */
        cEditor.state.inputs[inputIndex].innerHTML = '';

        /**
         * Append all childs founded before anchorNode
         */
        var previousChildsLength = previousChilds.length;

        for(var i = 0; i < previousChildsLength; i++) {
            cEditor.state.inputs[inputIndex].appendChild(previousChilds[i]);
        }

        cEditor.state.inputs[inputIndex].appendChild(textNodeBeforeCaret);

        /**
         * Append text node which is after caret
         */
        var nextChildsLength = nextChilds.length;
        newNode          = document.createElement('div');

        for(var i = 0; i < nextChildsLength; i++) {
            newNode.appendChild(nextChilds[i]);
        }

        newNode = newNode.innerHTML;

        /** This type of block creates when enter is pressed */
        var NEW_BLOCK_TYPE = 'paragraph';

        /**
         * Make new paragraph with text after caret
         */
        cEditor.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : cEditor.tools[NEW_BLOCK_TYPE].render({
                text : newNode,
            })
        });

    };

    /**
     * @protected
     *
     * Merges two blocks — current and target
     * If target index is not exist, then previous will be as target
     */
    var mergeBlocks = function(currentInputIndex, targetInputIndex) {

        /** If current input index is zero, then prevent method execution */
        if (currentInputIndex === 0) {
            return;
        }

        var targetInput,
            currentInputContent = cEditor.state.inputs[currentInputIndex].innerHTML;

        if (!targetInputIndex) {

            targetInput = cEditor.state.inputs[currentInputIndex - 1];

        } else {

            targetInput = cEditor.state.inputs[targetInputIndex];

        }

        targetInput.innerHTML += currentInputContent;
    };

    return {
        currentNode : currentNode,
        sync        : sync,
        markBlock   : markBlock,
        clearMark   : clearMark,
        getFirstLevelBlock : getFirstLevelBlock,
        workingNodeChanged : workingNodeChanged,
        replaceBlock       : replaceBlock,
        insertBlock        : insertBlock,
        switchBlock        : switchBlock,
        getDeepestTextNodeFromPosition : getDeepestTextNodeFromPosition,
        composeNewBlock    : composeNewBlock,
        getRange           : getRange,
        splitBlock         : splitBlock,
        mergeBlocks        : mergeBlocks
    }

})();

module.exports = content;