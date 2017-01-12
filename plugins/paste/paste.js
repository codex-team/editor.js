/**
 * Paste plugin.
 *
 */

/**
 * @protected
 *
 * Main tool settings.
 */
var pasteTool = {
    /**
     * Saves data
     * @param event
     */
    pasted : function(event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text');

        pasteTool.analize(content);
    },

    /**
     * Analizes pated string and calls necessary method
     */
    analize : function(string) {

        pasteTool.patterns.map(function(pattern, i){
            if (pattern.regex.test(string)) {
                pattern.callback.call(null, string, pattern);
            }
        })

    }
};


