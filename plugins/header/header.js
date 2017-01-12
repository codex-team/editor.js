/**
* Example of making plugin
* H e a d e r
*/


var header = (function(header) {

    /**
     * Make initial header block
     * @param {object} JSON with block data
     * @return {Element} element to append
     */
    header.make = function (data) {

        var availableTypes = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            tag;

        if (data && data.type && availableTypes.includes(data.type)) {

            tag = codex.draw.node( data.type, [], {} );

            /**
             * Save header type in data-attr.
             * We need it in save method to extract type from HTML to JSON
             */
            tag.dataset.headerData = data.type;

        } else {

            tag = codex.draw.node( 'H2', [], {} );
            tag.dataset.headerData = 'H2';

        }

        if (data && data.text) {
            tag.textContent = data.text;
        }

        if (!tag.dataset.headerData) {
            tag.dataset.headerData = 'H2';
        }

        tag.classList.add('ce-header');
        tag.setAttribute('data-placeholder', 'Heading');
        tag.contentEditable = true;

        return tag;

    };

    /**
     * Method to render HTML block from JSON
     */
    header.render = function (data) {

        return this.make(data);

    };

    /**
     * Method to extract JSON data from HTML block
     */
    header.save = function (blockContent) {

        var data = {
            "heading-styles": blockContent.dataset.headerData,
            "format": "html",
            "text": blockContent.textContent
        };

        return data;
    };

    /**
     * Block appending callback
     */
    header.appendCallback = function (argument) {
        console.log('header appended...');
    };

    /**
     * Settings panel content
     *  - - - - - - - - - - - - -
     * | настройки   H1  H2  H3  |
     *  - - - - - - - - - - - - -
     * @return {Element} element contains all settings
     */
    header.makeSettings = function () {

        var holder  = codex.draw.node('DIV', ['ce_plugin_header--settings'], {} ),
            types   = {
                H2: 'Заголовок раздела',
                H3: 'Подзаголовок',
                H4: 'Заголовок 3-его уровня'
            },
            selectTypeButton;

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = codex.draw.node('SPAN', ['ce_plugin_header--select_button'], { textContent : types[type] });
            this.addSelectTypeClickListener(selectTypeButton, type);
            holder.appendChild(selectTypeButton);

        }

        return holder;
    };

    /**
     * Binds click event to passed button
     */
    var addSelectTypeClickListener = function (el, type) {

        el.addEventListener('click', function () {

            this.selectTypeClicked(type);

        }, false);
    };

    /**
     * Replaces old header with new type
     * @params {string} type - new header tagName: H1—H6
     */
    var selectTypeClicked = function (type) {

        var old_header, new_header;

        /** Now current header stored as a currentNode */
        old_header = codex.content.currentNode.querySelector('[contentEditable]');

        /** Making new header */
        new_header = codex.draw.node(type, ['ce-header'], { innerHTML : old_header.innerHTML });
        new_header.contentEditable = true;
        new_header.setAttribute('data-placeholder', 'Heading');
        new_header.dataset.headerData = type;

        codex.content.switchBlock(old_header, new_header, 'header');

        /** Close settings after replacing */
        codex.toolbar.settings.close();
    };

    header.validate = function(data) {

        if (data.text.trim() == '' || data['heading-styles'].trim() == '')
            return;

        return true;
    };

    return header;

})({});

