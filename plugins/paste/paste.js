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
var pasteTool = {
    /**
     * Saves data
     * @param event
     */
    pasted : function(event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text'),
            pastedDataIsEmbeded;

        pastedDataIsEmbeded = pasteTool.analize(content);

        if ( pastedDataIsEmbeded ) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    },

    /**
     * Analizes pated string and calls necessary method
     */
    analize : function(string) {

        var isEmbed = false;

        pasteTool.patterns.map(function(pattern, i){
            if (pattern.regex.test(string)) {
                pattern.callback.call(null, string, pattern);
                isEmbed = true;
            }
        });

        return isEmbed;
    }
};


