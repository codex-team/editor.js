/**
 * Codex Editor Caret Module
 *
 * @author Codex Team
 * @version 1.0
 */

var caret = (function(caret) {

    /**
     * @var {int} InputIndex - editable element in DOM
     */
    caret.inputIndex = null;

    /**
     * @var {int} offset - caret position in a text node.
     */
    caret.offset = null;

    /**
     * @var {int} focusedNodeIndex - we get index of child node from first-level block
     */
    caret.focusedNodeIndex = null;

    /**
     * Creates Document Range and sets caret to the element.
     * @protected
     * @uses caret.save — if you need to save caret position
     * @param {Element} el - Changed Node.
     */
    caret.set = function( el , index, offset) {

        offset = offset || this.offset || 0;
        index  = index  || this.focusedNodeIndex || 0;

        var childs = el.childNodes,
            nodeToSet;

        if ( childs.length === 0 ) {

            nodeToSet = el;

        } else {

            nodeToSet = childs[index];

        }

        /** If Element is INPUT */
        if (el.tagName == 'INPUT') {
            el.focus();
            return;
        }

        if (codex.core.isDomNode(nodeToSet)) {

            nodeToSet = codex.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
        }

        var range     = document.createRange(),
            selection = window.getSelection();

        setTimeout(function() {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

            codex.caret.saveCurrentInputIndex();

        }, 20);
    };

    /**
     * @protected
     * Updates index of input and saves it in caret object
     */
    caret.saveCurrentInputIndex = function () {

        /** Index of Input that we paste sanitized content */
        var selection   = window.getSelection(),
            inputs      = codex.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        if (!focusedNode){
            return;
        }

        /** Looking for parent contentEditable block */
        while (focusedNode.contentEditable != 'true') {
            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;
        }

        /** Input index in DOM level */
        var editableElementIndex = 0;

        while (focusedNode != inputs[editableElementIndex]) {
            editableElementIndex ++;
        }

        this.inputIndex = editableElementIndex;
    };

    /**
     * Returns current input index (caret object)
     */
    caret.getCurrentInputIndex = function() {
        return this.inputIndex;
    };

    /**
     * @param {int} index - index of first-level block after that we set caret into next input
     */
    caret.setToNextBlock = function(index) {

        var inputs = codex.state.inputs,
            nextInput = inputs[index + 1];

        if (!nextInput) {
            codex.core.log('We are reached the end');
            return;
        }

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!nextInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            nextInput.appendChild(emptyTextElement);
        }

        codex.caret.inputIndex = index + 1;
        codex.caret.set(nextInput, 0, 0);
        codex.content.workingNodeChanged(nextInput);

    };

    /**
     * @param {int} index - index of target input.
     * Sets caret to input with this index
     */
    caret.setToBlock = function(index) {

        var inputs = codex.state.inputs,
            targetInput = inputs[index];

        console.assert( targetInput , 'caret.setToBlock: target input does not exists');

        if ( !targetInput ) {
            return;
        }

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!targetInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            targetInput.appendChild(emptyTextElement);
        }

        codex.caret.inputIndex = index;
        codex.caret.set(targetInput, 0, 0);
        codex.content.workingNodeChanged(targetInput);

    };

    /**
     * @param {int} index - index of input
     */
    caret.setToPreviousBlock = function(index) {

        index = index || 0;

        var inputs = codex.state.inputs,
            previousInput = inputs[index - 1],
            lastChildNode,
            lengthOfLastChildNode,
            emptyTextElement;


        if (!previousInput) {
            codex.core.log('We are reached first node');
            return;
        }

        lastChildNode = codex.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length);
        lengthOfLastChildNode = lastChildNode.length;

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!previousInput.childNodes.length) {

            emptyTextElement = document.createTextNode('');
            previousInput.appendChild(emptyTextElement);
        }
        codex.caret.inputIndex = index - 1;
        codex.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
        codex.content.workingNodeChanged(inputs[index - 1]);
    };

    caret.position = {

        atStart : function() {

            var selection       = window.getSelection(),
                anchorOffset    = selection.anchorOffset,
                anchorNode      = selection.anchorNode,
                firstLevelBlock = codex.content.getFirstLevelBlock(anchorNode),
                pluginsRender   = firstLevelBlock.childNodes[0];

            if (!codex.core.isDomNode(anchorNode)) {
                anchorNode = anchorNode.parentNode;
            }

            var isFirstNode  = anchorNode === pluginsRender.childNodes[0],
                isOffsetZero = anchorOffset === 0;

            return isFirstNode && isOffsetZero;

        },

        atTheEnd : function() {

            var selection    = window.getSelection(),
                anchorOffset = selection.anchorOffset,
                anchorNode   = selection.anchorNode;

            /** Caret is at the end of input */
            return !anchorNode || !anchorNode.length || anchorOffset === anchorNode.length;
        }
    };

    return caret;

})({});

module.exports = caret;