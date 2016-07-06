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

       return paragraphTool.make(data);

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
cEditor.tools.paragraph = {

    type           : 'paragraph',
    iconClassname  : 'ce-icon-paragraph',
    make           : paragraphTool.make,
    appendCallback : null,
    settings       : null,
    render         : paragraphTool.render,
    save           : paragraphTool.save

};
