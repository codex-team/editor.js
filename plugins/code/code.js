/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var codeTool = {

    baseClass : "ce-code",

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    make : function (data) {

        var tag = document.createElement('code');

        tag.classList.add(codeTool.baseClass);

        if (data && data.text) {
            tag.innerHTML = data.text;
        }

        tag.contentEditable = true;

        return tag;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (data) {

        return codeTool.make(data);

    },

    /**
     * Method to extract JSON data from HTML block
     */
    save : function (blockContent){

        var data = {
                text : null,
            };

        data.text = blockContent.innerHTML;

        return data;

    }

};
