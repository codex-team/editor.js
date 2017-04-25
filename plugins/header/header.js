/**
* Example of making plugin
* H e a d e r
*/

var header = (function(header_plugin) {

    /**
     * @private
     */
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

            codex.editor.content.switchBlock(old_header, new_header, 'header');

            /** Close settings after replacing */
            codex.editor.toolbar.settings.close();
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

        tag.classList.add('ce-header');
        tag.setAttribute('data-placeholder', 'Заголовок');
        tag.contentEditable = true;

        return tag;

    };

    header_plugin.prepareDataForSave = function(data) {

    };

    /**
     * Method to render HTML block from JSON
     */
    header_plugin.render = function (data) {

        return make_(data);

    };

    /**
     * Method to extract JSON data from HTML block
     */
    header_plugin.save = function (blockContent) {

        var data = {
            "heading-styles": blockContent.dataset.headerData,
            "format": "html",
            "text": blockContent.textContent || ''
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
    header_plugin.makeSettings = function () {

        var holder  = codex.editor.draw.node('DIV', ['cdx-plugin-settings--horisontal'], {} ),
            types   = {
                h2: 'H2',
                h3: 'H3',
                h4: 'H4'
            },
            selectTypeButton;

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = codex.editor.draw.node('SPAN', ['cdx-plugin-settings__item'], { textContent : types[type] });
            methods_.addSelectTypeClickListener(selectTypeButton, type);
            holder.appendChild(selectTypeButton);

        }

        return holder;
    };

    header_plugin.validate = function(data) {

        if (data.text.trim() === '' || data['heading-styles'].trim() === ''){
            return false;
        }

        return true;
    };

    header_plugin.destroy = function () {

        header = null;

    }

    return header_plugin;

})({});

