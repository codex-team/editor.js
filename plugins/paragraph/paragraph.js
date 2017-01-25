/**
* Paragraph Plugin\
* Creates P tag and adds content to this tag
*/
var paragraphTool = {

    /**
    * Make initial header block
    * @param {object} JSON with block data
    * @return {Element} element to append
    */
    make : function (data) {

        var tag = document.createElement('DIV');

        tag.classList.add('ce-paragraph');

        if (data && data.text) {
            tag.innerHTML = data.text;
        }

        tag.contentEditable = true;

        // var paragraph = document.createElement('P');
        // paragraph.setAttribute('data-placeholder', 'Расскажите свою историю');
        // tag.appendChild(paragraph);

        /**
         * @uses Paste tool callback.
         * Function analyzes pasted data
         * If pasted URL from instagram, twitter or Image
         * it renders via Social widgets content or uploads image and uses Image tool to render
         */
        tag.addEventListener('paste', codex.tools.paste.callbacks, false);

        return tag;

    },

    /**
    * Method to render HTML block from JSON
    */
    render : function (data) {

       return paragraphTool.make(data);

    },

    validate : function(output) {

        if (output.text == '')
            return;

        return output;
    },

    /**
    * Method to extract JSON data from HTML block
    */
    save : function (blockContent){

        var data = {
                text : null,
                format: "html",
                introText: '<<same>>'
            };

        data.text = blockContent.innerHTML;

        return data;

    }

};
