/**
 * Codex Editor Paste module
 *
 * @author Codex Team
 * @version 1.1.1
 */

module.exports = function (paste) {

    let editor = codex.editor;

    var patterns = [];

    paste.prepare = function () {

        var tools = editor.tools;

        for (var tool in tools) {

            if (!tools[tool].renderOnPastePatterns || !Array.isArray(tools[tool].renderOnPastePatterns)) {

                continue;

            }

            tools[tool].renderOnPastePatterns.map(function (pattern) {


                patterns.push(pattern);

            });

        }

        return Promise.resolve();

    };

    /**
     * Saves data
     * @param event
     */
    paste.pasted = function (event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text');

        var result = analize(content);

        if (result) {

            event.preventDefault();
            event.stopImmediatePropagation();

        }

        return result;

    };

    /**
     * Analizes pated string and calls necessary method
     */

    var analize = function (string) {

        var result  = false,
            content = editor.content.currentNode,
            plugin  = content.dataset.tool;

        patterns.map( function (pattern) {

            var execArray = pattern.regex.exec(string),
                match     = execArray && execArray[0];

            if ( match && match === string.trim()) {

                /** current block is not empty */
                if ( content.textContent.trim() && plugin == editor.settings.initialBlockPlugin ) {

                    pasteToNewBlock_();

                }

                pattern.callback(string, pattern);
                result = true;

            }

        });

        return result;

    };

    var pasteToNewBlock_ = function () {

        /** Create new initial block */
        editor.content.insertBlock({

            type : editor.settings.initialBlockPlugin,
            block : editor.tools[editor.settings.initialBlockPlugin].render({
                text : ''
            })

        }, false);

    };

    /**
     * This method prevents default behaviour.
     *
     * @param {Object} event
     * @protected
     *
     * @description We get from clipboard pasted data, sanitize, make a fragment that contains of this sanitized nodes.
     * Firstly, we need to memorize the caret position. We can do that by getting the range of selection.
     * After all, we insert clear fragment into caret placed position. Then, we should move the caret to the last node
     */
    paste.blockPasteCallback = function (event) {


        if (!needsToHandlePasteEvent(event.target)) {

            return;

        }

        /** Prevent default behaviour */
        event.preventDefault();

        /** get html pasted data - dirty data */
        var htmlData  = event.clipboardData.getData('text/html'),
            plainData = event.clipboardData.getData('text/plain');

        /** Temporary DIV that is used to work with text's paragraphs as DOM-elements*/
        var paragraphs = editor.draw.node('DIV', '', {}),
            cleanData,
            wrappedData;

        /** Create fragment, that we paste to range after proccesing */
        cleanData = editor.sanitizer.clean(htmlData);

        /**
         * We wrap pasted text with <p> tags to split it logically
         * @type {string}
         */
        wrappedData = editor.content.wrapTextWithParagraphs(cleanData, plainData);
        paragraphs.innerHTML = wrappedData;

        /**
         * If there only one paragraph, just insert in at the caret location
         */
        if (paragraphs.childNodes.length == 1) {

            emulateUserAgentBehaviour(paragraphs.firstChild);
            return;

        }

        insertPastedParagraphs(paragraphs.childNodes);

    };

    /**
     * Checks if we should handle paste event on block
     * @param block
     *
     * @return {boolean}
     */
    var needsToHandlePasteEvent = function (block) {

        /** If area is input or textarea then allow default behaviour */
        if ( editor.core.isNativeInput(block) ) {

            return false;

        }

        var editableParent = editor.content.getEditableParent(block);

        /** Allow paste when event target placed in Editable element */
        if (!editableParent) {

            return false;

        }

        return true;

    };

    /**
     * Inserts new initial plugin blocks with data in paragraphs
     *
     * @param {Array} paragraphs - array of paragraphs (<p></p>) whit content, that should be inserted
     */
    var insertPastedParagraphs = function (paragraphs) {

        var NEW_BLOCK_TYPE = editor.settings.initialBlockPlugin;

        paragraphs.forEach(function (paragraph, index) {

            /** Don't allow empty paragraphs */
            if (editor.core.isBlockEmpty(paragraph)) {

                return;

            }

            /**
             * If there was no data in working node, replace it with first paragraph of pasted text
             */
            if (index == 0 && editor.core.isBlockEmpty(editor.content.currentNode)) {

                editor.content.currentNode.remove();
                editor.caret.setToPreviousBlock(editor.caret.inputIndex);

            }

            editor.content.insertBlock({
                type  : NEW_BLOCK_TYPE,
                block : editor.tools[NEW_BLOCK_TYPE].render({
                    text : paragraph.innerHTML
                })
            });

            editor.caret.inputIndex++;

        });

        editor.caret.setToPreviousBlock(editor.caret.getCurrentInputIndex() + 1);


    };

    /**
     * Inserts node content at the caret position
     *
     * @param {Node} node - DOM node (could be DocumentFragment), that should be inserted at the caret location
     */
    var emulateUserAgentBehaviour = function (node) {

        var newNode;

        if (node.childElementCount) {

            newNode = document.createDocumentFragment();

            node.childNodes.forEach(function (current) {

                if (!editor.core.isDomNode(current) && current.data.trim() === '') {

                    return;

                }

                newNode.appendChild(current.cloneNode(true));

            });

        } else {

            newNode = document.createTextNode(node.textContent);

        }

        editor.caret.insertNode(newNode);

    };


    return paste;

}({});