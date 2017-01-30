/**
 * Codex Editor Content Module
 * Works with DOM
 *
 * @author Codex Team
 * @version 1.3.11
 */

var content = (function(content) {

    /**
     * Links to current active block
     * @type {null | Element}
     */
    content.currentNode = null;

    /**
     * clicked in redactor area
     * @type {null | Boolean}
     */
    content.editorAreaHightlighted = null;

    /**
     * Synchronizes redactor with original textarea
     */
    content.sync = function () {

        codex.core.log('syncing...');

        /**
         * Save redactor content to codex.state
         */
        codex.state.html = codex.nodes.redactor.innerHTML;

    };

    /**
     * @deprecated
     */
    content.getNodeFocused = function() {

        var selection = window.getSelection(),
            focused;

        if (selection.anchorNode === null) {
            return null;
        }

        if ( selection.anchorNode.nodeType == codex.core.nodeTypes.TAG ) {
            focused = selection.anchorNode;
        } else {
            focused = selection.focusNode.parentElement;
        }

        if ( !codex.parser.isFirstLevelBlock(focused) ) {

            /** Iterate with parent nodes to find first-level*/
            var parent = focused.parentNode;

            while (parent && !codex.parser.isFirstLevelBlock(parent)){
                parent = parent.parentNode;
            }

            focused = parent;
        }

        if (focused != codex.nodes.redactor){
            return focused;
        }

        return null;

    };

    /**
     * Appends background to the block
     */
    content.markBlock = function() {

        codex.content.currentNode.classList.add(codex.ui.className.BLOCK_HIGHLIGHTED);
    };

    /**
     * Clear background
     */
    content.clearMark = function() {

        if (codex.content.currentNode) {
            codex.content.currentNode.classList.remove(codex.ui.className.BLOCK_HIGHLIGHTED);
        }

    };

    /**
     * @private
     *
     * Finds first-level block
     * @param {Element} node - selected or clicked in redactors area node
     */
    content.getFirstLevelBlock = function(node) {

        if (!codex.core.isDomNode(node)) {
            node = node.parentNode;
        }

        if (node === codex.nodes.redactor || node === document.body) {

            return null;

        } else {

            while(!node.classList.contains(codex.ui.className.BLOCK_CLASSNAME)) {
                node = node.parentNode;
            }

            return node;
        }

    };

    /**
     * Trigger this event when working node changed
     * @param {Element} targetNode - first-level of this node will be current
     * If targetNode is first-level then we set it as current else we look for parents to find first-level
     */
    content.workingNodeChanged = function (targetNode) {

        /** Clear background from previous marked block before we change */
        codex.content.clearMark();

        if (!targetNode) {
            return;
        }

        this.currentNode = this.getFirstLevelBlock(targetNode);

    };

    /**
     * Replaces one redactor block with another
     * @protected
     * @param {Element} targetBlock - block to replace. Mostly currentNode.
     * @param {Element} newBlock
     * @param {string} newBlockType - type of new block; we need to store it to data-attribute
     *
     * [!] Function does not saves old block content.
     *     You can get it manually and pass with newBlock.innerHTML
     */
    content.replaceBlock = function function_name(targetBlock, newBlock) {

        if (!targetBlock || !newBlock){
            codex.core.log('replaceBlock: missed params');
            return;
        }

        /** If target-block is not a frist-level block, then we iterate parents to find it */
        while(!targetBlock.classList.contains(codex.ui.className.BLOCK_CLASSNAME)) {
            targetBlock = targetBlock.parentNode;
        }

        /**
         * Check is this block was in feed
         * If true, than set switched block also covered
         */
        if (targetBlock.classList.contains(codex.ui.className.BLOCK_IN_FEED_MODE)) {
            newBlock.classList.add(codex.ui.className.BLOCK_IN_FEED_MODE);
        }

        /** Replacing */
        codex.nodes.redactor.replaceChild(newBlock, targetBlock);

        /**
         * Set new node as current
         */
        codex.content.workingNodeChanged(newBlock);

        /**
         * Add block handlers
         */
        codex.ui.addBlockHandlers(newBlock);

        /**
         * Save changes
         */
        codex.ui.saveInputs();

    };

    /**
     * @private
     *
     * Inserts new block to redactor
     * Wrapps block into a DIV with BLOCK_CLASSNAME class
     *
     * @param blockData          {object}
     * @param blockData.block    {Element}   element with block content
     * @param blockData.type     {string}    block plugin
     * @param needPlaceCaret     {bool}      pass true to set caret in new block
     *
     */
    content.insertBlock = function( blockData, needPlaceCaret ) {

        var workingBlock    = codex.content.currentNode,
            newBlockContent = blockData.block,
            blockType       = blockData.type,
            cover           = blockData.cover,
            isStretched     = blockData.stretched;

        var newBlock = codex.content.composeNewBlock(newBlockContent, blockType, isStretched);

        if (cover === true) {
            newBlock.classList.add(codex.ui.className.BLOCK_IN_FEED_MODE);
        }

        if (workingBlock) {

            codex.core.insertAfter(workingBlock, newBlock);

        } else {
            /**
             * If redactor is empty, append as first child
             */
            codex.nodes.redactor.appendChild(newBlock);

        }

        /**
         * Block handler
         */
        codex.ui.addBlockHandlers(newBlock);

        /**
         * Set new node as current
         */
        codex.content.workingNodeChanged(newBlock);

        /**
         * Save changes
         */
        codex.ui.saveInputs();


        if ( needPlaceCaret ) {

            /**
             * If we don't know input index then we set default value -1
             */
            var currentInputIndex = codex.caret.getCurrentInputIndex() || -1;


            if (currentInputIndex == -1) {


                var editableElement = newBlock.querySelector('[contenteditable]'),
                    emptyText       = document.createTextNode('');

                editableElement.appendChild(emptyText);
                codex.caret.set(editableElement, 0, 0);

                codex.toolbar.move();
                codex.toolbar.showPlusButton();


            } else {

                if (currentInputIndex === codex.state.inputs.length - 1)
                    return;

                /** Timeout for browsers execution */
                setTimeout(function () {

                    /** Setting to the new input */
                    codex.caret.setToNextBlock(currentInputIndex);
                    codex.toolbar.move();
                    codex.toolbar.open();

                }, 10);

            }

        }

        /**
         * Block is inserted, wait for new click that defined focusing on editors area
         * @type {boolean}
         */
        content.editorAreaHightlighted = false;

    };

    /**
     * Replaces blocks with saving content
     * @protected
     * @param {Element} noteToReplace
     * @param {Element} newNode
     * @param {Element} blockType
     */
    content.switchBlock = function(blockToReplace, newBlock, tool){

        var newBlockComposed = codex.content.composeNewBlock(newBlock, tool);

        /** Replacing */
        codex.content.replaceBlock(blockToReplace, newBlockComposed);

        /** Save new Inputs when block is changed */
        codex.ui.saveInputs();
    };

    /**
     * Iterates between child noted and looking for #text node on deepest level
     * @private
     * @param {Element} block - node where find
     * @param {int} postiton - starting postion
     *      Example: childNodex.length to find from the end
     *               or 0 to find from the start
     * @return {Text} block
     * @uses DFS
     */
    content.getDeepestTextNodeFromPosition = function (block, position) {

        /**
         * Clear Block from empty and useless spaces with trim.
         * Such nodes we should remove
         */
        var blockChilds = block.childNodes,
            index,
            node,
            text;

        for(index = 0; index < blockChilds.length; index++)
        {
            node = blockChilds[index];

            if (node.nodeType == codex.core.nodeTypes.TEXT) {

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

            if ( block.nodeType == codex.core.nodeTypes.TAG ){

                position = block.childNodes.length;

            } else if (block.nodeType == codex.core.nodeTypes.TEXT ){

                position = 0;
            }

        }

        return block;
    };

    /**
     * @private
     */
    content.composeNewBlock = function (block, tool, isStretched) {

        var newBlock     = codex.draw.node('DIV', codex.ui.className.BLOCK_CLASSNAME, {}),
            blockContent = codex.draw.node('DIV', codex.ui.className.BLOCK_CONTENT, {});

        blockContent.appendChild(block);
        newBlock.appendChild(blockContent);

        if (isStretched) {
            blockContent.classList.add(codex.ui.className.BLOCK_STRETCHED);
        }

        newBlock.dataset.tool = tool;
        return newBlock;
    };

    /**
     * Returns Range object of current selection
     */
    content.getRange = function() {

        var selection = window.getSelection().getRangeAt(0);

        return selection;
    };

    /**
     * Divides block in two blocks (after and before caret)
     * @private
     * @param {Int} inputIndex - target input index
     */
    content.splitBlock = function(inputIndex) {

        var selection      = window.getSelection(),
            anchorNode     = selection.anchorNode,
            anchorNodeText = anchorNode.textContent,
            caretOffset    = selection.anchorOffset,
            textBeforeCaret,
            textNodeBeforeCaret,
            textAfterCaret,
            textNodeAfterCaret;

        var currentBlock = codex.content.currentNode.querySelector('[contentEditable]');


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

        for ( var i = 0, child; !!(child = currentBlock.childNodes[i]); i++) {

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
        codex.state.inputs[inputIndex].innerHTML = '';

        /**
         * Append all childs founded before anchorNode
         */
        var previousChildsLength = previousChilds.length;

        for(i = 0; i < previousChildsLength; i++) {
            codex.state.inputs[inputIndex].appendChild(previousChilds[i]);
        }

        codex.state.inputs[inputIndex].appendChild(textNodeBeforeCaret);

        /**
         * Append text node which is after caret
         */
        var nextChildsLength = nextChilds.length,
            newNode          = document.createElement('div');

        for(i = 0; i < nextChildsLength; i++) {
            newNode.appendChild(nextChilds[i]);
        }

        newNode = newNode.innerHTML;

        /** This type of block creates when enter is pressed */
        var NEW_BLOCK_TYPE = codex.settings.initialBlockPlugin;

        /**
         * Make new paragraph with text after caret
         */
        codex.content.insertBlock({
            type  : NEW_BLOCK_TYPE,
            block : codex.tools[NEW_BLOCK_TYPE].render({
                text : newNode
            })
        }, true );

    };

    /**
     * Merges two blocks — current and target
     * If target index is not exist, then previous will be as target
     */
    content.mergeBlocks = function(currentInputIndex, targetInputIndex) {

        /** If current input index is zero, then prevent method execution */
        if (currentInputIndex === 0) {
            return;
        }

        var targetInput,
            currentInputContent = codex.state.inputs[currentInputIndex].innerHTML;

        if (!targetInputIndex) {

            targetInput = codex.state.inputs[currentInputIndex - 1];

        } else {

            targetInput = codex.state.inputs[targetInputIndex];

        }

        targetInput.innerHTML += currentInputContent;
    };

    /**
     * @private
     *
     * Callback for HTML Mutations
     * @param {Array} mutation - Mutation Record
     */
    content.paste = function(mutation) {

        var workingNode = codex.content.currentNode,
            tool        = workingNode.dataset.tool;

        if (codex.tools[tool].allowedToPaste) {
            codex.content.sanitize.call(this, mutation.target);
        } else {
            codex.content.pasteTextContent(mutation.addedNodes);
        }

    };

    /**
     * @private
     *
     * gets only text/plain content of node
     * @param {Element} target - HTML node
     */
    content.pasteTextContent = function(nodes) {

        var node = nodes[0],
            textNode;

        if (!node) {
            return;
        }

        if (node.nodeType == codex.core.nodeTypes.TEXT) {
            textNode = document.createTextNode(node);
        } else {
            textNode = document.createTextNode(node.textContent);
        }

        if (codex.core.isDomNode(node)) {
            node.parentNode.replaceChild(textNode, node);
        }
    };

    /**
     * @private
     *
     * Sanitizes HTML content
     * @param {Element} target - inserted element
     * @uses Sanitize library html-janitor
     */
    content.sanitize = function(target) {

        if (!target) {
            return;
        }

        var node = target[0];

        if (!node) {
            return;
        }

        /**
         * Disconnect Observer
         * hierarchy of function calls inherits context of observer
         */
        this.disconnect();

        /**
         * Don't sanitize text node
         */
        if (node.nodeType == codex.core.nodeTypes.TEXT) {
            return;
        }

        /**
         * Clear dirty content
         */
        var cleaner = codex.sanitizer.init(codex.satinizer.Config.BASIC),
            clean = cleaner.clean(target.outerHTML);

        var div = codex.draw.node('DIV', [], { innerHTML: clean });
        node.replaceWith(div.childNodes[0]);


    };

    /**
     * Iterates all right siblings and parents, which has right siblings
     * while it does not reached the first-level block
     *
     * @param {Element} node
     * @return {boolean}
     */
    content.isLastNode = function(node) {

        // console.log('погнали перебор родителей');

        var allChecked = false;

        while ( !allChecked ) {

            // console.log('Смотрим на %o', node);
            // console.log('Проверим, пустые ли соседи справа');

            if ( !allSiblingsEmpty_(node) ){

                // console.log('Есть непустые соседи. Узел не последний. Выходим.');
                return false;

            }

            node = node.parentNode;

            /**
             * Проверяем родителей до тех пор, пока не найдем блок первого уровня
             */
            if ( node.classList.contains(codex.ui.className.BLOCK_CONTENT) ){
                allChecked = true;
            }

        }

        return true;

    };

    /**
     * Checks if all element right siblings is empty
     * @param node
     */
    var allSiblingsEmpty_ = function (node) {

        /**
         * Нужно убедиться, что после пустого соседа ничего нет
         */
        var sibling = node.nextSibling;

        while ( sibling ) {

            if (sibling.textContent.length){

                return false;

            }

            sibling = sibling.nextSibling;

        }

        return true;

    };

    /**
     * @public
     *
     * @param [String] htmlString - html content as string
     * @return {string} - html content as string
     */
    content.wrapTextIntoParagraphs = function(htmlString) {

        var wrapper = document.createElement('DIV'),
            newWrapper = document.createElement('DIV'),
            i,
            paragraph,
            firstLevelBlocks = ['DIV', 'P'],
            blockTyped,
            node;

        wrapper.innerHTML = htmlString;
        paragraph = document.createElement('P');

        for (i = 0; i < wrapper.childNodes.length; i++) {

            node = wrapper.childNodes[i];
            blockTyped = firstLevelBlocks.indexOf(node.tagName) != -1;

            if ( blockTyped ) {

                if ( paragraph.childNodes.length ){

                    newWrapper.appendChild(paragraph.cloneNode(true));

                    paragraph = null;
                    paragraph = document.createElement('P');

                }

                newWrapper.appendChild(node.cloneNode(true));

            } else {

                paragraph.appendChild(node.cloneNode(true));

                if ( i == wrapper.childNodes.length - 1 ){
                    newWrapper.appendChild(paragraph.cloneNode(true));
                }
            }
        }

        return newWrapper.innerHTML;

    };

    return content;

})({});

module.exports = content;