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
var paste = function(paste){
    /**
     * Saves data
     * @param event
     */
    paste.pasted = function(event) {

        var clipBoardData = event.clipboardData || window.clipboardData,
            content = clipBoardData.getData('Text');

        analize(content);
    };

    /**
     * Analizes pated string and calls necessary method
     */
    var analize = function(string) {

        paste.patterns.map(function(pattern, i){
            if (pattern.regex.test(string)) {
                pattern.callback.call(null, string, pattern);
            }
        })

    }

    return paste;

}(paste || {});


