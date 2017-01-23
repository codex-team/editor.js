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
            content = clipBoardData.getData('Text');
        
        pasteTool.analize(content, event);
    },

    /**
     * Analizes pated string and calls necessary method
     */
    analize : function(string, event) {

        var embed = false;

        pasteTool.patterns.map(function(pattern, i){
            if (pattern.regex.test(string)) {
                pattern.callback.call(null, string, pattern);
                embed = true;
            }
        });

        /**
         * Stop other event handlers 
         */
        if (embed) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
        }

    }
};


