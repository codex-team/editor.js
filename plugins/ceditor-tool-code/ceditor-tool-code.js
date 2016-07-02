/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var codeTool = {

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    make : function (data) {

        var tag = document.createElement('code');

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
    save : function (block){

        var data = {
            text : null
        };

        data.text = blockData.textContent;

        return data;

    },

};

/**
 * Now plugin is ready.
 * Add it to redactor tools
 */
cEditor.tools.code = {

    type           : 'code',
    iconClassname  : 'ce-icon-code',
    make           : codeTool.make,
    appendCallback : null,
    settings       : null,
    render         : codeTool.render,
    save           : codeTool.save

};