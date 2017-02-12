/**
 * Codex Editor Paste module
 *
 * @author Codex Team
 * @version 1.0
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

            if (pattern.regex.test(string)) {

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


    return paste;

}({});