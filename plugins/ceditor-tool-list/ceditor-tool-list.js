/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var listTool = {

    baseClass : "tool-list",
    elementClasses : {
        li  : "tool-list-li"
    },

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    make : function () {

        var tag = listTool.ui.make(),
            li = this.block("li", "tool-link-li");

        tag.appendChild(li);

        return tag;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (data) {

        var tag = listTool.ui.make();

        data.items.forEach(function (element, index, array) {

            var newLi = listTool.ui.block("li", listTool.elementClasses.li);

            newLi.innerHTML = element;

            tag.appendChild(newLi);

        });

        return tag;

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

    makeSettings : function(data) {

        var holder  = document.createElement('DIV'),
            caption = document.createElement('SPAN'),
            types   = {
                unordered    : 'Обычный список',
                ordered      : 'Нумерованный список'
            },
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_list--settings'

        /** Add settings helper caption */
        caption.textContent = 'Настройки списков';
        caption.className   = 'ce_plugin_list--caption';

        holder.appendChild(caption);

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];

            selectTypeButton.className   = 'ce_plugin_list--select_button';

            var quoteStyle = quoteTools.selectTypeQuoteStyle(type);
            quoteTools.addSelectTypeClickListener(selectTypeButton, quoteStyle);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    },


};

listTool.ui = {

    make : function (json) {

        var wrapper = this.block("div", listTool.baseClass);

        wrapper.contentEditable = true;

        return wrapper;

    },

    block : function (blockType, blockClass = "") {

        var block = document.createElement(blockType);

        block.classList.add(blockClass);

        return block;

    }
};

/**
 * Now plugin is ready.
 * Add it to redactor tools
 */
cEditor.tools.list = {

    type           : 'list',
    iconClassname  : 'ce-icon-list-bullet',
    make           : listTool.make,
    appendCallback : null,
    settings       : listTool.makeSettings(),
    render         : listTool.render,
    save           : listTool.save

};