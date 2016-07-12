/**
* List Plugin\
*
* @author CodeX Team <team@ifmo.su>
* @version 0.0.1
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
            li  = listTool.ui.block("li", "tool-link-li");

        tag.appendChild(li);

        return tag;

    },

    /**
     * Method to render HTML block from JSON
     */
    render : function (data) {

        var type = data.type == 'ordered' ? 'OL' : 'UL',
            tag  = listTool.ui.make(type);

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
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_list--settings';

        /** Add settings helper caption */
        caption.textContent = 'Настройки списков';
        caption.className   = 'ce_plugin_list--caption';

        var orderedButton = listTool.ui.button("ordered"),
            unorderedButton = listTool.ui.button("unordered");

        orderedButton.addEventListener('click', function (event) {
            listTool.changeBlockStyle(event, 'ol');
            cEditor.toolbar.settings.close();
        });

        unorderedButton.addEventListener('click', function (event) {
            listTool.changeBlockStyle(event, 'ul');
            cEditor.toolbar.settings.close();
        });

        holder.appendChild(caption);
        holder.appendChild(orderedButton);
        holder.appendChild(unorderedButton);

        return holder;

    },

    changeBlockStyle : function (event, blockType) {

        var currentBlock = cEditor.content.currentNode,
            newEditable = listTool.ui.make(blockType),
            oldEditable = currentBlock.querySelector("[contenteditable]");

        newEditable.innerHTML = oldEditable.innerHTML;

        currentBlock.appendChild(newEditable);
        oldEditable.remove();

    },

};

listTool.ui = {

    make : function (blockType) {

        var wrapper = this.block(blockType || 'UL', listTool.baseClass);

        wrapper.contentEditable = true;

        return wrapper;

    },

    block : function (blockType, blockClass) {

        var block = document.createElement(blockType);

        if ( blockClass ) block.classList.add(blockClass);

        return block;

    },

    button : function (buttonType) {

        var types   = {
                unordered    : 'Обычный список',
                ordered      : 'Нумерованный список'
            },
            button = document.createElement('SPAN');

        button.textContent = types[buttonType];

        button.className   = 'ce_plugin_list--select_button';

        return button;
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
