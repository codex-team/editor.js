/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var list = (function(list) {

    var baseClass = "tool-list";

    var elementClasses = {
        li  : "tool-list-li"
    };

    var ui = {

        make: function (blockType) {

            var wrapper = this.block(blockType || 'UL', baseClass);

            wrapper.dataset.type = 'UL';
            wrapper.contentEditable = true;

            return wrapper;

        },

        block: function (blockType, blockClass) {

            var block = document.createElement(blockType);

            if (blockClass) block.classList.add(blockClass);

            return block;

        },

        button: function (buttonType) {

            var types = {
                    unordered: '<i class="ce-icon-list-bullet"></i>Обычный список',
                    ordered: '<i class="ce-icon-list-numbered"></i>Нумерованный список'
                },
                button = document.createElement('SPAN');

            button.innerHTML = types[buttonType];

            button.className = 'ce_plugin_list--select_button';

            return button;
        }
    };

    var methods = {

        /**
         * Changes block type => OL or UL
         * @param event
         * @param blockType
         */
        changeBlockStyle : function (event, blockType) {

            var currentBlock = codex.content.currentNode,
                newEditable = ui.make(blockType),
                oldEditable = currentBlock.querySelector("[contenteditable]");

            newEditable.dataset.type = blockType;
            newEditable.innerHTML = oldEditable.innerHTML;
            newEditable.classList.add('ce-list');

            codex.content.switchBlock(currentBlock, newEditable, 'list');
        }
    };

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    list.make = function () {

        var tag = ui.make(),
            li  = ui.block("li", "tool-link-li");

        var br = document.createElement("br");

        li.appendChild(br);
        tag.appendChild(li);

        tag.classList.add('ce-list');

        return tag;

    };

    /**
     * Method to render HTML block from JSON
     */
    list.render = function (data) {

        var type = data.type == 'ordered' ? 'OL' : 'UL',
            tag  = ui.make(type);

        tag.classList.add('ce-list');

        data.items.forEach(function (element, index, array) {

            var newLi = ui.block("li", listTool.elementClasses.li);

            newLi.innerHTML = element;

            tag.dataset.type = data.type;
            tag.appendChild(newLi);

        });

        return tag;

    };

    list.validate = function(data) {

        var items = data.items.every(function(item){
            return item.trim() != '';
        });

        if (!items)
            return;

        if (data.type != 'UL' && data.type != 'OL')
            return;

        return true;
    };

    /**
     * Method to extract JSON data from HTML block
     */
    list.save = function (blockContent){

        var data = {
            type  : null,
            items : []
        };

        for(var index = 0; index < blockContent.childNodes.length; index++)
            data.items[index] = blockContent.childNodes[index].textContent;

        data.type = blockContent.dataset.type;

        return data;

    };

    list.makeSettings = function(data) {

        var holder  = document.createElement('DIV'),
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_list--settings';

        var orderedButton = ui.button("ordered"),
            unorderedButton = ui.button("unordered");

        orderedButton.addEventListener('click', function (event) {
            methods.changeBlockStyle(event, 'OL');
            codex.toolbar.settings.close();
        });

        unorderedButton.addEventListener('click', function (event) {
            methods.changeBlockStyle(event, 'UL');
            codex.toolbar.settings.close();
        });

        holder.appendChild(orderedButton);
        holder.appendChild(unorderedButton);

        return holder;

    };

    return list;

})({});
