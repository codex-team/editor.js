/**
* Example of making plugin
* H e a d e r
*/

var header = (function(header) {

    /**
     * @private
     */
    var currentHeader = null;

    var methods_ = {

        /**
         * Binds click event to passed button
         */
        addSelectTypeClickListener : function (el, type) {

            el.addEventListener('click', function () {

                methods_.selectTypeClicked(type);

            }, false);
        },

        /**
         * Replaces old header with new type
         * @params {string} type - new header tagName: H1—H6
         */
        selectTypeClicked : function (type) {

            var old_header, new_header;

            /** Now current header stored as a currentNode */
            old_header = codex.editor.content.currentNode.querySelector('[contentEditable]');

            /** Making new header */
            new_header = codex.editor.draw.node(type, ['ce-header'], { innerHTML : old_header.innerHTML });
            new_header.contentEditable = true;
            new_header.setAttribute('data-placeholder', 'Заголовок');
            new_header.dataset.headerData = type;
            new_header.dataset.anchor = old_header.dataset.anchor;

            codex.editor.content.switchBlock(old_header, new_header, 'heading_styled');

            /** Close settings after replacing */
            codex.editor.toolbar.settings.close();
        },

        anchorChanged: function (e) {

            var newAnchor = e.target.value = methods_.rusToTranslit(e.target.value);

            if (newAnchor.trim() != '')
                currentHeader.dataset.anchor = newAnchor;

        },

        keyDownOnAnchorInput: function(e) {

            if (e.keyCode == 13) {

                e.preventDefault();
                e.stopPropagation();

                e.target.blur();

            }

        },

        keyUpOnAnchorInput: function(e) {

            if (e.keyCode >= 37 && e.keyCode <= 40) {
                e.stopPropagation();
            }

        },

        rusToTranslit: function (string) {

            var ru = [
                    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й',
                    'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф',
                    'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ь', 'Э', 'Ю', 'Я'
                ],
                en = [
                    'A', 'B', 'V', 'G', 'D', 'E', 'E', 'Zh', 'Z', 'I', 'Y',
                    'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F',
                    'H', 'C', 'Ch', 'Sh', 'Sch', '', 'Y', '', 'E', 'Yu', 'Ya'
                ];

            for (var i = 0; i < ru.length; i++) {

                string = string.split(ru[i]).join(en[i]);
                string = string.split(ru[i].toLowerCase()).join(en[i].toLowerCase());

            }

            string = string.replace(/[^0-9a-zA-Z_]+/g, '-');

            return string;

        }

    };

    /**
     * @private
     *
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    var make_ = function (data) {

        var availableTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            tag,
            anchor = '',
            headerType = 'h2';


        if ( data && data['heading-styles'] && availableTypes.includes(data['heading-styles']) ) {

            headerType = data['heading-styles'];

        }

        tag = document.createElement(headerType);

        /**
         * Save header type in data-attr.
         * We need it in save method to extract type from HTML to JSON
         */
        tag.dataset.headerData = headerType;

        if (data && data.text) {
            tag.textContent = data.text;
        }

        if (!tag.dataset.headerData) {
            tag.dataset.headerData = 'h2';
        }

        if (data && data.anchor) {
            anchor = data.anchor;
        }

        tag.dataset.anchor = anchor;

        tag.classList.add('ce-header');
        tag.setAttribute('data-placeholder', 'Заголовок');
        tag.contentEditable = true;

        return tag;

    };

    header.prepareDataForSave = function(data) {

    };

    /**
     * Method to render HTML block from JSON
     */
    header.render = function (data) {

        return make_(data);

    };

    /**
     * Method to extract JSON data from HTML block
     */
    header.save = function (blockContent) {

        var data = {
            "heading-styles": blockContent.dataset.headerData,
            "format": "html",
            "text": blockContent.textContent || '',
            "anchor": blockContent.dataset.anchor
        };

        return data;
    };

    /**
     * Settings panel content
     *  - - - - - - - - - - - - -
     * | настройки   H1  H2  H3  |
     *  - - - - - - - - - - - - -
     * @return {Element} element contains all settings
     */
    header.makeSettings = function () {

        var holder  = codex.editor.draw.node('DIV', ['ce_plugin_header--settings'], {} ),
            types   = {
                h2: 'Заголовок H2',
                h3: 'Заголовок H3',
                h4: 'Заголовок H4'
            },
            block  = codex.editor.content.currentNode,
            headerBlock = block.querySelector('[contenteditable="true"]'),
            selectTypeButton,
            anchorWrapper = codex.editor.draw.node('div', [ 'ce_plugin_header--anchor_wrapper' ], {}),
            hash   = codex.editor.draw.node('span', [ 'ce_plugin_header--anchor_hash' ], {}),
            anchor = codex.editor.draw.node('input', [ 'ce_plugin_header--anchor_input' ], { placeholder: 'якорь' });

        currentHeader = headerBlock;

        anchor.value = headerBlock.dataset.anchor || '';

        anchor.addEventListener('keydown', methods_.keyDownOnAnchorInput );
        anchor.addEventListener('keyup', methods_.keyUpOnAnchorInput );
        anchor.addEventListener('input', methods_.anchorChanged );

        anchorWrapper.appendChild(hash);
        anchorWrapper.appendChild(anchor);

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = codex.editor.draw.node('SPAN', ['ce_plugin_header--select_button'], { textContent : types[type] });
            methods_.addSelectTypeClickListener(selectTypeButton, type);
            holder.appendChild(selectTypeButton);

        }

        holder.appendChild(anchorWrapper);

        anchor.focus();

        return holder;
    };

    header.validate = function(data) {

        if (data.text.trim() === '' || data['heading-styles'].trim() === ''){
            return false;
        }

        return true;
    };

    return header;

})({});

