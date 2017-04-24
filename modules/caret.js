/**
 * Codex Editor Caret Module
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function (caret) {

    let editor = codex.editor;

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
    caret.set = function ( el, index, offset) {

        offset = offset || caret.offset || 0;
        index  = index  || caret.focusedNodeIndex || 0;

        var childs = el.childNodes,
            nodeToSet;

        if ( childs.length === 0 ) {

            nodeToSet = el;

        } else {

            nodeToSet = childs[index];

        }

        /** If Element is INPUT */
        if (el.contentEditable != 'true') {

            el.focus();
            return;

        }

        if (editor.core.isDomNode(nodeToSet)) {

            nodeToSet = editor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);

        }

        var range     = document.createRange(),
            selection = window.getSelection();

        window.setTimeout(function () {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

            editor.caret.saveCurrentInputIndex();

        }, 20);

    };

    /**
     * @protected
     * Updates index of input and saves it in caret object
     */
    caret.saveCurrentInputIndex = function () {

        /** Index of Input that we paste sanitized content */
        var selection   = window.getSelection(),
            inputs      = editor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        if (!focusedNode) {

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

        caret.inputIndex = editableElementIndex;

    };

    /**
     * Returns current input index (caret object)
     */
    caret.getCurrentInputIndex = function () {

        return caret.inputIndex;

    };

    /**
     * @param {int} index - index of first-level block after that we set caret into next input
     */
    caret.setToNextBlock = function (index) {

        var inputs = editor.state.inputs,
            nextInput = inputs[index + 1];

        if (!nextInput) {

            editor.core.log('We are reached the end');
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

        editor.caret.inputIndex = index + 1;
        editor.caret.set(nextInput, 0, 0);
        editor.content.workingNodeChanged(nextInput);

    };

    /**
     * @param {int} index - index of target input.
     * Sets caret to input with this index
     */
    caret.setToBlock = function (index) {

        var inputs = editor.state.inputs,
            targetInput = inputs[index];

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

        editor.caret.inputIndex = index;
        editor.caret.set(targetInput, 0, 0);
        editor.content.workingNodeChanged(targetInput);

    };

    /**
     * @param {int} index - index of input
     */
    caret.setToPreviousBlock = function (index) {

        index = index || 0;

        var inputs = editor.state.inputs,
            previousInput = inputs[index - 1],
            lastChildNode,
            lengthOfLastChildNode,
            emptyTextElement;


        if (!previousInput) {

            editor.core.log('We are reached first node');
            return;

        }

        lastChildNode = editor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length);
        lengthOfLastChildNode = lastChildNode.length;

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!previousInput.childNodes.length) {

            emptyTextElement = document.createTextNode('');
            previousInput.appendChild(emptyTextElement);

        }
        editor.caret.inputIndex = index - 1;
        editor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
        editor.content.workingNodeChanged(inputs[index - 1]);

    };

    caret.position = {

        atStart : function () {

            var selection       = window.getSelection(),
                anchorOffset    = selection.anchorOffset,
                anchorNode      = selection.anchorNode,
                firstLevelBlock = editor.content.getFirstLevelBlock(anchorNode),
                pluginsRender   = firstLevelBlock.childNodes[0];

            if (!editor.core.isDomNode(anchorNode)) {

                anchorNode = anchorNode.parentNode;

            }

            var isFirstNode  = anchorNode === pluginsRender.childNodes[0],
                isOffsetZero = anchorOffset === 0;

            return isFirstNode && isOffsetZero;

        },

        atTheEnd : function () {

            var selection    = window.getSelection(),
                anchorOffset = selection.anchorOffset,
                anchorNode   = selection.anchorNode;

            /** Caret is at the end of input */
            return !anchorNode || !anchorNode.length || anchorOffset === anchorNode.length;

        }
    };


    /**
     * Inserts node at the caret location
     * @param node
     */
    caret.insertNode = function (node) {

        var selection, range,
            lastNode = node;

        if (node instanceof window.DocumentFragment) {

            lastNode = node.lastChild;

        }

        selection = window.getSelection();

        range = selection.getRangeAt(0);
        range.deleteContents();

        range.insertNode(node);

        range.setStartAfter(lastNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);


    };

    return caret;

})({});