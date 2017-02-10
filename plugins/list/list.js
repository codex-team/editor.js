/**
 * Code Plugin\
 * Creates code tag and adds content to this tag
 */
var list = (function(list) {

    var baseClass = "cdx-plugin-list";

    var elementClasses = {
        li  : "cdx-plugin-list__li"
    };

    var ui = {

        make: function (blockType) {

            var wrapper = this.block(blockType || 'UL', baseClass);

            wrapper.dataset.type = blockType;
            wrapper.contentEditable = true;

            wrapper.addEventListener('keydown', methods.keyDown);

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

            button.classList.add('cdx-plugin-settings__item');

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

            var currentBlock = codex.editor.content.currentNode,
                newEditable = ui.make(blockType),
                oldEditable = currentBlock.querySelector("[contenteditable]");

            newEditable.dataset.type = blockType;
            newEditable.innerHTML = oldEditable.innerHTML;
            newEditable.classList.add('cdx-plugin-list');

            codex.editor.content.switchBlock(currentBlock, newEditable, 'list');
        },

        keyDown: function (e) {

            /* If ctrl+A was pressed, we should select only one list item */

            var controlKeyPressed = e.ctrlKey || e.metaKey,
                keyCodeForA = 65;

            if (controlKeyPressed && e.keyCode == keyCodeForA) {

                e.preventDefault();

                var selection = window.getSelection(),
                    currentItem = selection.anchorNode,
                    range = new Range();

                range.selectNode(currentItem);

                selection.removeAllRanges();
                selection.addRange(range);


            }

        }
    };

    /**
     * Method to render HTML block from JSON
     */
    list.render = function (data) {

        var type = data && data.type == 'ordered' ? 'OL' : 'UL',
            tag  = ui.make(type),
            newLi;

        if (data && data.items) {

            data.items.forEach(function (element, index, array) {

                newLi = ui.block('li', elementClasses.li);

                newLi.innerHTML = element;

                tag.appendChild(newLi);

            });

        } else {

            newLi = ui.block('li', elementClasses.li);

            tag.appendChild(newLi);

        }

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

    list.makeSettings = function () {

        var holder  = document.createElement('DIV');

        /** Add holder classname */
        holder.className = 'cdx-plugin-list__settings';

        var orderedButton = ui.button("ordered"),
            unorderedButton = ui.button("unordered");

        orderedButton.addEventListener('click', function (event) {
            methods.changeBlockStyle(event, 'OL');
            codex.editor.toolbar.settings.close();
        });

        unorderedButton.addEventListener('click', function (event) {
            methods.changeBlockStyle(event, 'UL');
            codex.editor.toolbar.settings.close();
        });

        holder.appendChild(orderedButton);
        holder.appendChild(unorderedButton);

        return holder;

    };

    return list;

})({});
