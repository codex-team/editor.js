/**
* Paragraph Plugin
* Creates DIV tag and adds content to this tag
*/

var paragraph = (function(paragraph_plugin) {

    /**
     * @private
     *
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */

    var make_ = function (data) {

        /** Create Empty DIV */
        var tag = codex.editor.draw.node('DIV', ['ce-paragraph'], {});

        if (data && data.text) {
            tag.innerHTML = data.text;
        }

        tag.contentEditable = true;

        /**
         * @uses Paste tool callback.
         * Function analyzes pasted data
         * If pasted URL from instagram, twitter or Image
         * it renders via Social widgets content or uploads image and uses Image tool to render
         */
        tag.addEventListener('paste', codex.editor.tools.paste.callbacks, false);

        return tag;

    };

    /**
     * @private
     *
     * Handles input data for save
     * @param data
     */
    var prepareDataForSave_ = function(data) {

    };

    /**
     * @public
     *
     * Plugins should have prepare method
     * @param config
     */
    paragraph_plugin.prepare = function(config) {

    };

    /*
     * @public
     *
     * Method to render HTML block from JSON
     */
    paragraph_plugin.render = function (data) {

        return make_(data);

    };

    /**
     * @public
     *
     * Check output data for validity.
     * Should be defined by developer
     */
    paragraph_plugin.validate = function(output) {

        if (output.text === '')
            return;

        return output;
    };

    /**
     * @public
     *
     * Method to extract JSON data from HTML block
     */
    paragraph_plugin.save = function (blockContent){

        var wrappedText = codex.editor.content.wrapTextWithParagraphs(blockContent.innerHTML);

        var data = {
            "text": wrappedText,
            "format": "html",
            "introText": '<<same>>'
        };

        return data;

    };

    paragraph_plugin.destroy = function () {

        paragraph = null;
        delete window.paragraph;

    };

    return paragraph_plugin;

})({});
