/**
* Paragraph Plugin
* Creates DIV tag and adds content to this tag
*/

var paragraph = (function(paragraph_plugin) {

    /**
     * @private
     *
     * Make initial paragraph block
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

        var wrappedText = codex.editor.content.wrapTextWithParagraphs(blockContent.innerHTML),
            sanitizerConfig = {
                tags : {
                    p : {},
                    a: {
                        href: true,
                        target: '_blank',
                        rel: 'nofollow'
                    },
                    i: {},
                    b: {},
                }
            };

        var data = {
            "text": codex.editor.sanitizer.clean(wrappedText, sanitizerConfig),
            "format": "html",
            "introText": '<<same>>'
        };

        return data;

    };

    paragraph_plugin.destroy = function () {

        paragraph = null;

    };

    return paragraph_plugin;

})({});
