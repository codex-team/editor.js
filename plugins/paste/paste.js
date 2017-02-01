/**
 * Paste plugin.
 *
 * Listen to clipboard paste event and analize pasted text whit patterns in pattern.js
 */

/**
 * @protected
 *
 * Main tool settings.
 */

let editor = codex.editor;

var paste = function(paste){
    /**
     * Saves data
     * @param event
     */
    paste.pasted = function(event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text');

        var result = analize(content);

        if (result) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    /**
     * Analizes pated string and calls necessary method
     */

    var analize = function(string) {

        var result  = false,
            content = editor.content.currentNode;

        paste.patterns.map(function(pattern, i){

            if (pattern.regex.test(string)) {

                /** current block is not empty */
                if (content.textContent.trim()) {
                    pasteToNewBlock_();
                }

                pattern.callback.call(null, string, pattern);
                result = true;
            }
        });

        return result;

    };

    var pasteToNewBlock_ = function() {

        /** Create new initial block */
        editor.content.insertBlock({

            type : editor.settings.initialBlockPlugin,
            block : editor.tools[editor.settings.initialBlockPlugin].render({
                text : ''
            })

        }, true);

    };

    return paste;

}(paste || {});


