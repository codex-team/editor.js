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

var paste = function(paste_plugin) {

    let editor = codex.editor;

    /**
     * Saves data
     * @param event
     */
    paste_plugin.pasted = function(event) {

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
            content = editor.content.currentNode,
            plugin  = content.dataset.tool;

        paste_plugin.patterns.map(function(pattern, i){

            if (pattern.regex.test(string)) {

                /** current block is not empty */
                if ( content.textContent.trim() && plugin == editor.settings.initialBlockPlugin ) {

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

        }, false);

    };

    paste_plugin.destroy = function () {

        paste = null;
        delete window.paste;

    };

    return paste_plugin;

}(paste || {});


