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

        var result = false;

        paste.patterns.map(function(pattern, i){
            if (pattern.regex.test(string)) {
                pattern.callback.call(null, string, pattern);
                result = true;
            }
        });

        return result;

    };


    return paste;

}(paste || {});


