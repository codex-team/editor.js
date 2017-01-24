/**
* Example of making plugin
* H e a d e r
*/
var headerTool = {

    /**
    * Make initial header block
    * @param {object} JSON with block data
    * @return {Element} element to append
    */
    make : function (data) {

        var availableTypes = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            tag;

        if (data && data.type && availableTypes.includes(data.type)) {

            tag = document.createElement( data.type );

            /**
            * Save header type in data-attr.
            * We need it in save method to extract type from HTML to JSON
            */
            tag.dataset.headerData = data.type;

        } else {

            tag = document.createElement( 'H2' );
            tag.dataset.headerData = 'H2';

        }

        if (data && data.text) {
            tag.textContent = data.text;
        }

        tag.classList.add('ce-header');
        tag.setAttribute('data-placeholder', 'Heading');
        tag.contentEditable = true;

        return tag;

    },

    /**
    * Method to render HTML block from JSON
    */
    render : function (data) {

       return headerTool.make(data);

    },

    validate : function(output) {

        var heading_styles = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

        if (!heading_styles.includes(output["heading-styles"]) || output["text"].trim() == '') {
            return;
        }

        return output;
    },

    /**
    * Method to extract JSON data from HTML block
    */
    save : function (blockContent) {

        var data = {
                "heading-styles": blockContent.dataset.headerData,
                format:"html",
                text : null

            };

        data.text = blockContent.textContent;

        return data;

    },

    /**
    * Block appending callback
    */
    appendCallback : function (argument) {

        console.log('header appended...');

    },

    /**
    * Settings panel content
    *  - - - - - - - - - - - - -
    * | настройки   H1  H2  H3  |
    *  - - - - - - - - - - - - -
    * @return {Element} element contains all settings
    */
    makeSettings : function () {

        var holder  = document.createElement('DIV'),
            types   = {
                        H2: 'Заголовок раздела',
                        H3: 'Подзаголовок',
                        H4: 'Заголовок 3-его уровня'
                    },
            selectTypeButton;

        /** Add holder classname */
        holder.className = 'ce_plugin_header--settings';

        /** Now add type selectors */
        for (var type in types){

            selectTypeButton = document.createElement('SPAN');

            selectTypeButton.textContent = types[type];
            selectTypeButton.className   = 'ce_plugin_header--select_button';

            headerTool.addSelectTypeClickListener(selectTypeButton, type);

            holder.appendChild(selectTypeButton);

        }

        return holder;

    },

    /**
    * Binds click event to passed button
    */
    addSelectTypeClickListener : function (el, type) {

        el.addEventListener('click', function () {

            headerTool.selectTypeClicked(type);

        }, false);
    },

    /**
    * Replaces old header with new type
    * @params {string} type - new header tagName: H1—H6
    */
    selectTypeClicked : function (type) {

        var old_header, new_header;

        /** Now current header stored as a currentNode */
        old_header = codex.content.currentNode.querySelector('[contentEditable]');

        /** Making new header */
        new_header = document.createElement(type);

        new_header.innerHTML = old_header.innerHTML;
        new_header.contentEditable = true;
        new_header.setAttribute('data-placeholder', 'Heading');
        new_header.classList.add('ce-header');

        new_header.dataset.headerData = type;

        codex.content.switchBlock(old_header, new_header, 'heading_styled');

        /** Close settings after replacing */
        codex.toolbar.settings.close();
    }

};
