/**
 * Codex Editor Content Module
 * Works with DOM
 *
 * @class Content
 * @classdesc Class works provides COdex Editor appearance logic
 *
 * @author Codex Team
 * @version 2.0.0
 */

import $ from '../dom';

module.exports = class Content {

    /**
     * Module key name
     * @returns {string}
     */
    static get name() {

        return 'Content';

    }

    /**
     * @constructor
     *
     * @param {EditorConfig} config
     */
    constructor(config) {

        this.config = config;
        this.Editor = null;

        this.CSS = {
            block: 'ce-block',
            content: 'ce-block__content',
            stretched: 'ce-block--stretched',
            highlighted: 'ce-block--highlighted',
        };

        this._currentNode = null;
        this._currentIndex = 0;

    }

    /**
     * Editor modules setter
     * @param {object} Editor
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * Get current working node
     *
     * @returns {null|HTMLElement}
     */
    get currentNode() {

        return this._currentNode;

    }

    /**
     * Set working node. Working node should be first level block, so we find it before set one to _currentNode property
     *
     * @param {HTMLElement} node
     */
    set currentNode(node) {

        let firstLevelBlock = this.getFirstLevelBlock(node);

        this._currentNode = firstLevelBlock;

    }


    /**
     * @private
     * @param pluginHTML
     * @param {Boolean} isStretched - make stretched block or not
     *
     * @description adds necessary information to wrap new created block by first-level holder
     */
    composeBlock_(pluginHTML, isStretched = false) {

        let block     = $.make('DIV', this.CSS.block),
            blockContent = $.make('DIV', this.CSS.content);

        blockContent.appendChild(pluginHTML);
        block.appendChild(blockContent);

        if (isStretched) {

            blockContent.classList.add(this.CSS.stretched);

        }

        block.dataset.toolId = this._currentIndex++;

        return block;

    };

    /**
     * Finds first-level block
     * @description looks for first-level block.
     * gets parent while node is not first-level
     *
     * @param {Element} node - selected or clicked in redactors area node
     * @protected
     *
     */
    getFirstLevelBlock(node) {

        if (!$.isNode(node)) {

            node = node.parentNode;

        }

        if (node === this.Editor.ui.nodes.redactor || node === document.body) {

            return null;

        } else {

            while(node.classList && !node.classList.contains(this.CSS.block)) {

                node = node.parentNode;

            }

            return node;

        }

    };

    /**
     * Insert new block to working area
     *
     * @param {HTMLElement} tool
     *
     * @returns {Number} tool index
     *
     */
    insertBlock(tool) {

        let newBlock = this.composeBlock_(tool);

        if (this.currentNode) {

            this.currentNode.insertAdjacentElement('afterend', newBlock);

        } else {

            /**
             * If redactor is empty, append as first child
             */
            this.Editor.ui.nodes.redactor.appendChild(newBlock);

        }

        /**
         * Set new node as current
         */
        this.currentNode = newBlock;

        return newBlock.dataset.toolId;

    }

};

// module.exports = (function (content) {
//
//     let editor = codex.editor;
//
//     /**
//      * Links to current active block
//      * @type {null | Element}
//      */
//     content.currentNode = null;
//
//     /**
//      * clicked in redactor area
//      * @type {null | Boolean}
//      */
//     content.editorAreaHightlighted = null;
//
//     /**
//      * @deprecated
//      * Synchronizes redactor with original textarea
//      */
//     content.sync = function () {
//
//         editor.core.log('syncing...');
//
//         /**
//          * Save redactor content to editor.state
//          */
//         editor.state.html = editor.nodes.redactor.innerHTML;
//
//     };
//
//     /**
//      * Appends background to the block
//      *
//      * @description add CSS class to highlight visually first-level block area
//      */
//     content.markBlock = function () {
//
//         editor.content.currentNode.classList.add(editor.ui.className.BLOCK_HIGHLIGHTED);
//
//     };
//
//     /**
//      * Clear background
//      *
//      * @description clears styles that highlights block
//      */
//     content.clearMark = function () {
//
//         if (editor.content.currentNode) {
//
//             editor.content.currentNode.classList.remove(editor.ui.className.BLOCK_HIGHLIGHTED);
//
//         }
//
//     };
//
//     /**
//      * Finds first-level block
//      *
//      * @param {Element} node - selected or clicked in redactors area node
//      * @protected
//      *
//      * @description looks for first-level block.
//      * gets parent while node is not first-level
//      */
//     content.getFirstLevelBlock = function (node) {
//
//         if (!editor.core.isDomNode(node)) {
//
//             node = node.parentNode;
//
//         }
//
//         if (node === editor.nodes.redactor || node === document.body) {
//
//             return null;
//
//         } else {
//
//             while(!node.classList.contains(editor.ui.className.BLOCK_CLASSNAME)) {
//
//                 node = node.parentNode;
//
//             }
//
//             return node;
//
//         }
//
//     };
//
//     /**
//      * Trigger this event when working node changed
//      * @param {Element} targetNode - first-level of this node will be current
//      * @protected
//      *
//      * @description If targetNode is first-level then we set it as current else we look for parents to find first-level
//      */
//     content.workingNodeChanged = function (targetNode) {
//
//         /** Clear background from previous marked block before we change */
//         editor.content.clearMark();
//
//         if (!targetNode) {
//
//             return;
//
//         }
//
//         content.currentNode = content.getFirstLevelBlock(targetNode);
//
//     };
//
//     /**
//      * Replaces one redactor block with another
//      * @protected
//      * @param {Element} targetBlock - block to replace. Mostly currentNode.
//      * @param {Element} newBlock
//      * @param {string} newBlockType - type of new block; we need to store it to data-attribute
//      *
//      * [!] Function does not saves old block content.
//      *     You can get it manually and pass with newBlock.innerHTML
//      */
//     content.replaceBlock = function (targetBlock, newBlock) {
//
//         if (!targetBlock || !newBlock) {
//
//             editor.core.log('replaceBlock: missed params');
//             return;
//
//         }
//
//         /** If target-block is not a frist-level block, then we iterate parents to find it */
//         while(!targetBlock.classList.contains(editor.ui.className.BLOCK_CLASSNAME)) {
//
//             targetBlock = targetBlock.parentNode;
//
//         }
//
//         /** Replacing */
//         editor.nodes.redactor.replaceChild(newBlock, targetBlock);
//
//         /**
//          * Set new node as current
//          */
//         editor.content.workingNodeChanged(newBlock);
//
//         /**
//          * Add block handlers
//          */
//         editor.ui.addBlockHandlers(newBlock);
//
//         /**
//          * Save changes
//          */
//         editor.ui.saveInputs();
//
//     };
//
//     /**
//      * @protected
//      *
//      * Inserts new block to redactor
//      * Wrapps block into a DIV with BLOCK_CLASSNAME class
//      *
//      * @param blockData          {object}
//      * @param blockData.block    {Element}   element with block content
//      * @param blockData.type     {string}    block plugin
//      * @param needPlaceCaret     {bool}      pass true to set caret in new block
//      *
//      */
//     content.insertBlock = function ( blockData, needPlaceCaret ) {
//
//         var workingBlock    = editor.content.currentNode,
//             newBlockContent = blockData.block,
//             blockType       = blockData.type,
//             isStretched     = blockData.stretched;
//
//         var newBlock = composeNewBlock_(newBlockContent, blockType, isStretched);
//
//         if (workingBlock) {
//
//             editor.core.insertAfter(workingBlock, newBlock);
//
//         } else {
//
//             /**
//              * If redactor is empty, append as first child
//              */
//             editor.nodes.redactor.appendChild(newBlock);
//
//         }
//
//         /**
//          * Block handler
//          */
//         editor.ui.addBlockHandlers(newBlock);
//
//         /**
//          * Set new node as current
//          */
//         editor.content.workingNodeChanged(newBlock);
//
//         /**
//          * Save changes
//          */
//         editor.ui.saveInputs();
//
//
//         if ( needPlaceCaret ) {
//
//             /**
//              * If we don't know input index then we set default value -1
//              */
//             var currentInputIndex = editor.caret.getCurrentInputIndex() || -1;
//
//
//             if (currentInputIndex == -1) {
//
//
//                 var editableElement = newBlock.querySelector('[contenteditable]'),
//                     emptyText       = document.createTextNode('');
//
//                 editableElement.appendChild(emptyText);
//                 editor.caret.set(editableElement, 0, 0);
//
//                 editor.toolbar.move();
//                 editor.toolbar.showPlusButton();
//
//
//             } else {
//
//                 if (currentInputIndex === editor.state.inputs.length - 1)
//                     return;
//
//                 /** Timeout for browsers execution */
//                 window.setTimeout(function () {
//
//                     /** Setting to the new input */
//                     editor.caret.setToNextBlock(currentInputIndex);
//                     editor.toolbar.move();
//                     editor.toolbar.open();
//
//                 }, 10);
//
//             }
//
//         }
//
//         /**
//          * Block is inserted, wait for new click that defined focusing on editors area
//          * @type {boolean}
//          */
//         content.editorAreaHightlighted = false;
//
//     };
//
//     /**
//      * Replaces blocks with saving content
//      * @protected
//      * @param {Element} noteToReplace
//      * @param {Element} newNode
//      * @param {Element} blockType
//      */
//     content.switchBlock = function (blockToReplace, newBlock, tool) {
//
//         tool = tool || editor.content.currentNode.dataset.tool;
//         var newBlockComposed = composeNewBlock_(newBlock, tool);
//
//         /** Replacing */
//         editor.content.replaceBlock(blockToReplace, newBlockComposed);
//
//         /** Save new Inputs when block is changed */
//         editor.ui.saveInputs();
//
//     };
//
//     /**
//      * Iterates between child noted and looking for #text node on deepest level
//      * @protected
//      *
//      * @param {Element} block - node where find
//      * @param {int} postiton - starting postion
//      *      Example: childNodex.length to find from the end
//      *               or 0 to find from the start
//      * @return {Text} block
//      * @uses DFS
//      */
//     content.getDeepestTextNodeFromPosition = function (block, position) {
//
//         /**
//          * Clear Block from empty and useless spaces with trim.
//          * Such nodes we should remove
//          */
//         var blockChilds = block.childNodes,
//             index,
//             node,
//             text;
//
//         for(index = 0; index < blockChilds.length; index++) {
//
//             node = blockChilds[index];
//
//             if (node.nodeType == editor.core.nodeTypes.TEXT) {
//
//                 text = node.textContent.trim();
//
//                 /** Text is empty. We should remove this child from node before we start DFS
//                  * decrease the quantity of childs.
//                  */
//                 if (text === '') {
//
//                     block.removeChild(node);
//                     position--;
//
//                 }
//
//             }
//
//         }
//
//         if (block.childNodes.length === 0) {
//
//             return document.createTextNode('');
//
//         }
//
//         /** Setting default position when we deleted all empty nodes */
//         if ( position < 0 )
//             position = 1;
//
//         var lookingFromStart = false;
//
//         /** For looking from START */
//         if (position === 0) {
//
//             lookingFromStart = true;
//             position = 1;
//
//         }
//
//         while ( position ) {
//
//             /** initial verticle of node. */
//             if ( lookingFromStart ) {
//
//                 block = block.childNodes[0];
//
//             } else {
//
//                 block = block.childNodes[position - 1];
//
//             }
//
//             if ( block.nodeType == editor.core.nodeTypes.TAG ) {
//
//                 position = block.childNodes.length;
//
//             } else if (block.nodeType == editor.core.nodeTypes.TEXT ) {
//
//                 position = 0;
//
//             }
//
//         }
//
//         return block;
//
//     };
//
//     /**
//      * @private
//      * @param {Element} block - current plugins render
//      * @param {String} tool - plugins name
//      * @param {Boolean} isStretched - make stretched block or not
//      *
//      * @description adds necessary information to wrap new created block by first-level holder
//      */
//     var composeNewBlock_ = function (block, tool, isStretched) {
//
//         var newBlock     = editor.draw.node('DIV', editor.ui.className.BLOCK_CLASSNAME, {}),
//             blockContent = editor.draw.node('DIV', editor.ui.className.BLOCK_CONTENT, {});
//
//         blockContent.appendChild(block);
//         newBlock.appendChild(blockContent);
//
//         if (isStretched) {
//
//             blockContent.classList.add(editor.ui.className.BLOCK_STRETCHED);
//
//         }
//
//         newBlock.dataset.tool   = tool;
//         return newBlock;
//
//     };
//
//     /**
//      * Returns Range object of current selection
//      * @protected
//      */
//     content.getRange = function () {
//
//         var selection = window.getSelection().getRangeAt(0);
//
//         return selection;
//
//     };
//
//     /**
//      * Divides block in two blocks (after and before caret)
//      *
//      * @protected
//      * @param {int} inputIndex - target input index
//      *
//      * @description splits current input content to the separate blocks
//      * When enter is pressed among the words, that text will be splited.
//      */
//     content.splitBlock = function (inputIndex) {
//
//         var selection      = window.getSelection(),
//             anchorNode     = selection.anchorNode,
//             anchorNodeText = anchorNode.textContent,
//             caretOffset    = selection.anchorOffset,
//             textBeforeCaret,
//             textNodeBeforeCaret,
//             textAfterCaret,
//             textNodeAfterCaret;
//
//         var currentBlock = editor.content.currentNode.querySelector('[contentEditable]');
//
//
//         textBeforeCaret     = anchorNodeText.substring(0, caretOffset);
//         textAfterCaret      = anchorNodeText.substring(caretOffset);
//
//         textNodeBeforeCaret = document.createTextNode(textBeforeCaret);
//
//         if (textAfterCaret) {
//
//             textNodeAfterCaret  = document.createTextNode(textAfterCaret);
//
//         }
//
//         var previousChilds = [],
//             nextChilds     = [],
//             reachedCurrent = false;
//
//         if (textNodeAfterCaret) {
//
//             nextChilds.push(textNodeAfterCaret);
//
//         }
//
//         for ( var i = 0, child; !!(child = currentBlock.childNodes[i]); i++) {
//
//             if ( child != anchorNode ) {
//
//                 if ( !reachedCurrent ) {
//
//                     previousChilds.push(child);
//
//                 } else {
//
//                     nextChilds.push(child);
//
//                 }
//
//             } else {
//
//                 reachedCurrent = true;
//
//             }
//
//         }
//
//         /** Clear current input */
//         editor.state.inputs[inputIndex].innerHTML = '';
//
//         /**
//          * Append all childs founded before anchorNode
//          */
//         var previousChildsLength = previousChilds.length;
//
//         for(i = 0; i < previousChildsLength; i++) {
//
//             editor.state.inputs[inputIndex].appendChild(previousChilds[i]);
//
//         }
//
//         editor.state.inputs[inputIndex].appendChild(textNodeBeforeCaret);
//
//         /**
//          * Append text node which is after caret
//          */
//         var nextChildsLength = nextChilds.length,
//             newNode          = document.createElement('div');
//
//         for(i = 0; i < nextChildsLength; i++) {
//
//             newNode.appendChild(nextChilds[i]);
//
//         }
//
//         newNode = newNode.innerHTML;
//
//         /** This type of block creates when enter is pressed */
//         var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;
//
//         /**
//          * Make new paragraph with text after caret
//          */
//         editor.content.insertBlock({
//             type  : NEW_BLOCK_TYPE,
//             block : editor.tools[NEW_BLOCK_TYPE].render({
//                 text : newNode
//             })
//         }, true );
//
//     };
//
//     /**
//      * Merges two blocks — current and target
//      * If target index is not exist, then previous will be as target
//      *
//      * @protected
//      * @param {int} currentInputIndex
//      * @param {int} targetInputIndex
//      *
//      * @description gets two inputs indexes and merges into one
//      */
//     content.mergeBlocks = function (currentInputIndex, targetInputIndex) {
//
//         /** If current input index is zero, then prevent method execution */
//         if (currentInputIndex === 0) {
//
//             return;
//
//         }
//
//         var targetInput,
//             currentInputContent = editor.state.inputs[currentInputIndex].innerHTML;
//
//         if (!targetInputIndex) {
//
//             targetInput = editor.state.inputs[currentInputIndex - 1];
//
//         } else {
//
//             targetInput = editor.state.inputs[targetInputIndex];
//
//         }
//
//         targetInput.innerHTML += currentInputContent;
//
//     };
//
//     /**
//      * Iterates all right siblings and parents, which has right siblings
//      * while it does not reached the first-level block
//      *
//      * @param {Element} node
//      * @return {boolean}
//      */
//     content.isLastNode = function (node) {
//
//         // console.log('погнали перебор родителей');
//
//         var allChecked = false;
//
//         while ( !allChecked ) {
//
//             // console.log('Смотрим на %o', node);
//             // console.log('Проверим, пустые ли соседи справа');
//
//             if ( !allSiblingsEmpty_(node) ) {
//
//                 // console.log('Есть непустые соседи. Узел не последний. Выходим.');
//                 return false;
//
//             }
//
//             node = node.parentNode;
//
//             /**
//              * Проверяем родителей до тех пор, пока не найдем блок первого уровня
//              */
//             if ( node.classList.contains(editor.ui.className.BLOCK_CONTENT) ) {
//
//                 allChecked = true;
//
//             }
//
//         }
//
//         return true;
//
//     };
//
//     /**
//      * Checks if all element right siblings is empty
//      * @param node
//      */
//     var allSiblingsEmpty_ = function (node) {
//
//         /**
//          * Нужно убедиться, что после пустого соседа ничего нет
//          */
//         var sibling = node.nextSibling;
//
//         while ( sibling ) {
//
//             if (sibling.textContent.length) {
//
//                 return false;
//
//             }
//
//             sibling = sibling.nextSibling;
//
//         }
//
//         return true;
//
//     };
//
//     /**
//      * @public
//      *
//      * @param {string} htmlData - html content as string
//      * @param {string} plainData - plain text
//      * @return {string} - html content as string
//      */
//     content.wrapTextWithParagraphs = function (htmlData, plainData) {
//
//         if (!htmlData.trim()) {
//
//             return wrapPlainTextWithParagraphs(plainData);
//
//         }
//
//         var wrapper = document.createElement('DIV'),
//             newWrapper = document.createElement('DIV'),
//             i,
//             paragraph,
//             firstLevelBlocks = ['DIV', 'P'],
//             blockTyped,
//             node;
//
//         /**
//          * Make HTML Element to Wrap Text
//          * It allows us to work with input data as HTML content
//          */
//         wrapper.innerHTML = htmlData;
//         paragraph = document.createElement('P');
//
//         for (i = 0; i < wrapper.childNodes.length; i++) {
//
//             node = wrapper.childNodes[i];
//
//             blockTyped = firstLevelBlocks.indexOf(node.tagName) != -1;
//
//             /**
//              * If node is first-levet
//              * we add this node to our new wrapper
//              */
//             if ( blockTyped ) {
//
//                 /**
//                  * If we had splitted inline nodes to paragraph before
//                  */
//                 if ( paragraph.childNodes.length ) {
//
//                     newWrapper.appendChild(paragraph.cloneNode(true));
//
//                     /** empty paragraph */
//                     paragraph = null;
//                     paragraph = document.createElement('P');
//
//                 }
//
//                 newWrapper.appendChild(node.cloneNode(true));
//
//             } else {
//
//                 /** Collect all inline nodes to one as paragraph */
//                 paragraph.appendChild(node.cloneNode(true));
//
//                 /** if node is last we should append this node to paragraph and paragraph to new wrapper */
//                 if ( i == wrapper.childNodes.length - 1 ) {
//
//                     newWrapper.appendChild(paragraph.cloneNode(true));
//
//                 }
//
//             }
//
//         }
//
//         return newWrapper.innerHTML;
//
//     };
//
//     /**
//      * Splits strings on new line and wraps paragraphs with <p> tag
//      * @param plainText
//      * @returns {string}
//      */
//     var wrapPlainTextWithParagraphs = function (plainText) {
//
//         if (!plainText) return '';
//
//         return '<p>' + plainText.split('\n\n').join('</p><p>') + '</p>';
//
//     };
//
//     /**
//     * Finds closest Contenteditable parent from Element
//     * @param {Element} node     element looking from
//     * @return {Element} node    contenteditable
//     */
//     content.getEditableParent = function (node) {
//
//         while (node && node.contentEditable != 'true') {
//
//             node = node.parentNode;
//
//         }
//
//         return node;
//
//     };
//
//     /**
//     * Clear editors content
//      *
//      * @param {Boolean} all — if true, delete all article data (content, id, etc.)
//     */
//     content.clear = function (all) {
//
//         editor.nodes.redactor.innerHTML = '';
//         editor.content.sync();
//         editor.ui.saveInputs();
//         if (all) {
//
//             editor.state.blocks = {};
//
//         } else if (editor.state.blocks) {
//
//             editor.state.blocks.items = [];
//
//         }
//
//         editor.content.currentNode = null;
//
//     };
//
//     /**
//     *
//      * Load new data to editor
//      * If editor is not empty, just append articleData.items
//      *
//     * @param articleData.items
//     */
//     content.load = function (articleData) {
//
//         var currentContent = Object.assign({}, editor.state.blocks);
//
//         editor.content.clear();
//
//         if (!Object.keys(currentContent).length) {
//
//             editor.state.blocks = articleData;
//
//         } else if (!currentContent.items) {
//
//             currentContent.items = articleData.items;
//             editor.state.blocks = currentContent;
//
//         } else {
//
//             currentContent.items = currentContent.items.concat(articleData.items);
//             editor.state.blocks = currentContent;
//
//         }
//
//         editor.renderer.makeBlocksFromData();
//
//     };
//
//     return content;
//
// })({});