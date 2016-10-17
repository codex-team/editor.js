/**
 * Caret module
 *
 * @author Codex team
 * @version 1.0.0
 */

var caret = (function() {

    /**
     * @var {int} InputIndex - editable element in DOM
     */
    var inputIndex = null;

    /**
     * @var {int} offset - caret position in a text node.
     */
    var offset = null;

    /**
     * @var {int} focusedNodeIndex - we get index of child node from first-level block
     */
    var focusedNodeIndex = null;

    /**
     * @protected
     *
     * Creates Document Range and sets caret to the element.
     * @protected
     * @uses caret.save — if you need to save caret position
     * @param {Element} el - Changed Node.
     */
    var set = function( el , index, offset) {

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

        if (cEditor.core.isDomNode(nodeToSet)) {

            nodeToSet = cEditor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);
        }

        var range     = document.createRange(),
            selection = window.getSelection();

        setTimeout(function() {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

        }, 20);
    };

    /**
     * @protected
     *
     * updates index of input and saves it in caret object
     */
    var saveCurrentInputIndex = function () {

        /** Index of Input that we paste sanitized content */
        var selection   = window.getSelection(),
            inputs      = cEditor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

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
     * @protected
     *
     * Returns current input index (caret object)
     */
    var getCurrentInputIndex = function() {
        return this.inputIndex;
    };

    /**
     * @protected
     *
     * @param {int} index - index of first-level block after that we set caret into next input
     */
    var setToNextBlock = function(index) {

        var inputs = cEditor.state.inputs,
            nextInput = inputs[index + 1];

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!nextInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            nextInput.appendChild(emptyTextElement);
        }

        cEditor.caret.inputIndex = index + 1;
        cEditor.caret.set(nextInput, 0, 0);
        cEditor.content.workingNodeChanged(nextInput);

    };

    /**
     * @protected
     *
     * @param {int} index - index of target input.
     * Sets caret to input with this index
     */
    var setToBlock = function(index) {

        var inputs = cEditor.state.inputs,
            targetInput = inputs[index];

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!targetInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            targetInput.appendChild(emptyTextElement);
        }

        cEditor.caret.inputIndex = index;
        cEditor.caret.set(targetInput, 0, 0);
        cEditor.content.workingNodeChanged(targetInput);

    };

    /**
     * @protected
     *
     * @param {int} index - index of input
     */
    var setToPreviousBlock = function(index) {

        index = index || 0;

        var inputs = cEditor.state.inputs,
            previousInput = inputs[index - 1];

        var lastChildNode = cEditor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length),
            lengthOfLastChildNode = lastChildNode.length;

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!previousInput.childNodes.length) {
            var emptyTextElement = document.createTextNode('');
            previousInput.appendChild(emptyTextElement);
        }
        cEditor.caret.inputIndex = index - 1;
        cEditor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
        cEditor.content.workingNodeChanged(inputs[index - 1]);
    };

    /**
     * @protected
     *
     * Checks carets position
     * @type {{atStart: position.atStart, atTheEnd: position.atTheEnd}}
     */
    var position = {

        atStart : function() {

            var selection       = window.getSelection(),
                anchorOffset    = selection.anchorOffset,
                anchorNode      = selection.anchorNode,
                firstLevelBlock = cEditor.content.getFirstLevelBlock(anchorNode),
                pluginsRender   = firstLevelBlock.childNodes[0];

            var isFirstNode  = anchorNode === pluginsRender.childNodes[0],
                isOffsetZero = anchorOffset === 0;

            if (isFirstNode && isOffsetZero) {
                return true;
            } else {
                return false;
            }
        },

        atTheEnd : function() {

            var selection    = window.getSelection(),
                anchorOffset = selection.anchorOffset,
                anchorNode   = selection.anchorNode;

            /** Caret is at the end of input */
            if (anchorOffset === anchorNode.length) {
                return true;
            } else {
                return false;
            }
        }
    };

    return {
        inputIndex              : inputIndex,
        offset                  : offset,
        focusedNodeIndex        : focusedNodeIndex,
        set                     : set,
        saveCurrentInputIndex   : saveCurrentInputIndex,
        getCurrentInputIndex    : getCurrentInputIndex,
        setToNextBlock          : setToNextBlock,
        setToBlock              : setToBlock,
        setToPreviousBlock      : setToPreviousBlock,
        position                : position
    }

})();

module.exports = caret;