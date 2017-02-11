/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var list = (function(list_plugin) {

    /**
    * CSS class names
    */
    var elementClasses_ = {
        pluginWrapper: 'cdx-plugin-list',
        li:            'cdx-plugin-list__li',
        settings:      'cdx-plugin-list__settings',
        settingsItem:  'cdx-plugin-settings__item'
    };

    var LIST_ITEM_TAG = 'LI';

    var ui = {

        make: function (blockType) {

            var wrapper = this.block(blockType || 'UL', elementClasses_.pluginWrapper);

            wrapper.dataset.type = blockType;
            wrapper.contentEditable = true;

            wrapper.addEventListener('keydown', methods_.keyDown);

            return wrapper;

        },

        block: function (blockType, blockClass) {

            var block = document.createElement(blockType);

            if (blockClass) block.classList.add(blockClass);

            return block;

        },

        button: function (buttonType) {

            var types = {
                    unordered: '<i class="ce-icon-list-bullet"></i>Обычный',
                    ordered: '<i class="ce-icon-list-numbered"></i>Нумерованный'
                },
                button = document.createElement('DIV');

            button.innerHTML = types[buttonType];

            button.classList.add(elementClasses_.settingsItem);

            return button;
        }
    };

    var methods_ = {

        /**
         * Changes block type => OL or UL
         * @param event
         * @param blockType
         */
        changeBlockStyle : function (event, blockType) {

            var currentBlock = codex.editor.content.currentNode,
                newEditable = ui.make(blockType),
                oldEditable = currentBlock.querySelector("[contenteditable]");

            newEditable.dataset.type = blockType;
            newEditable.innerHTML = oldEditable.innerHTML;
            newEditable.classList.add(elementClasses_.pluginWrapper);

            codex.editor.content.switchBlock(currentBlock, newEditable, 'list');
        },
        keyDown: function (e) {

            var controlKeyPressed = e.ctrlKey || e.metaKey,
                keyCodeForA = 65;

            /**
            * If CTRL+A (CMD+A) was pressed, we should select only one list item,
            * not all <OL> or <UI>
            */
            if (controlKeyPressed && e.keyCode == keyCodeForA) {

                e.preventDefault();

                /**
                * Select <LI> content
                */
                methods_.selectListItem();

            }

        },

        /**
        * Select all content of <LI> with caret
        */
        selectListItem : function () {

            var selection = window.getSelection(),
                currentSelectedNode = selection.anchorNode.parentNode,
                range = new Range();

            /**
            * Search for <LI> element
            */
            while ( currentSelectedNode && currentSelectedNode.tagName != LIST_ITEM_TAG ) {

                currentSelectedNode = currentSelectedNode.parentNode;

            }

            range.selectNodeContents(currentSelectedNode);

            selection.removeAllRanges();
            selection.addRange(range);

        }
    };

    /**
     * Method to render HTML block from JSON
     */
    list_plugin.render = function (data) {

        var type = data && data.type == 'ordered' ? 'OL' : 'UL',
            tag  = ui.make(type),
            newLi;

        if (data && data.items) {

            data.items.forEach(function (element, index, array) {

                newLi = ui.block('li', elementClasses_.li);

                newLi.innerHTML = element;

                tag.appendChild(newLi);

            });

        } else {

            newLi = ui.block('li', elementClasses_.li);

            tag.appendChild(newLi);

        }

        return tag;

    };

    list_plugin.validate = function(data) {

        var items = data.items.every(function(item){
            return item.trim() !== '';
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
    list_plugin.save = function (blockContent){

        var data = {
            type  : null,
            items : []
        };

        for(var index = 0; index < blockContent.childNodes.length; index++)
            data.items[index] = blockContent.childNodes[index].textContent;

        data.type = blockContent.dataset.type;

        return data;

    };

    list_plugin.makeSettings = function () {

        var holder  = document.createElement('DIV');

        /** Add holder classname */
        holder.className = elementClasses_.settings;

        var orderedButton = ui.button("ordered"),
            unorderedButton = ui.button("unordered");

        orderedButton.addEventListener('click', function (event) {
            methods_.changeBlockStyle(event, 'OL');
            codex.editor.toolbar.settings.close();
        });

        unorderedButton.addEventListener('click', function (event) {
            methods_.changeBlockStyle(event, 'UL');
            codex.editor.toolbar.settings.close();
        });

        holder.appendChild(orderedButton);
        holder.appendChild(unorderedButton);

        return holder;

    };

    list_plugin.destroy = function () {

        list = null;

    };

    return list_plugin;

})({});
