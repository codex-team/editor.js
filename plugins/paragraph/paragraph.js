/**
* Paragraph Plugin
* Creates P tag and adds content to this tag
*/

var paragraph = (function(paragraph) {

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    paragraph.make = function (data) {

        /** Create Empty DIV */
        var tag = codex.draw.node('DIV', ['ce-paragraph'], {});

        if (data && data.text) {
            tag.innerHTML = data.text;
        }

        tag.contentEditable = true;

        /**
         * if plugin need to add placeholder
         * tag.setAttribute('data-placeholder', 'placehoder');
         */

        /**
         * @uses Paste tool callback.
         * Function analyzes pasted data
         * If pasted URL from instagram, twitter or Image
         * it renders via Social widgets content or uploads image and uses Image tool to render
         */
        tag.addEventListener('paste', codex.tools.paste.callbacks.pasted, false);

        return tag;

    };

    /**
     * Method to render HTML block from JSON
     */
    paragraph.render = function (data) {

        return this.make(data);

    };

    /**
     * Method to extract JSON data from HTML block
     */
    paragraph.save = function (blockContent){

        var data = {
            text : null,
            format: "html",
            introText: '<<same>>'
        };

        data.text = blockContent.innerHTML;

        return data;

    };

    /**
     * Validate data.
     * Define which objects are important and which are not
     *
     * @param data
     *
     * @return [Boolean]
     */
    paragraph.validate = function(data) {

        /**
         * Do not allow:
         *  - Empty text
         */
        if (data.text.trim() == '')
            return;

        return true;

    };

    return paragraph;

})({});
