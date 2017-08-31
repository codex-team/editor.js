/**
* Example of making plugin
* H e a d e r
*/

var header = function () {

    const name = 'header';

    let headerType = 'h2',
        headerElement = null;

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

            var newElement;

            /** Making new header */
            newElement = document.createElement(type);
            newElement.classList.add('ce-header');
            newElement.innerHTML = headerElement.innerHTML;
            newElement.contentEditable = true;
            newElement.setAttribute('data-placeholder', 'Заголовок');
            headerType = type;
            newElement.tool = headerElement.tool;

            headerElement.parentNode.replaceChild(newElement, headerElement);
            headerElement = newElement;

        }

    };

    /**
     * Method to render HTML block from JSON
     */
    function render(data) {

        let availableTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        if ( data && data['heading-styles'] && availableTypes.includes(data['heading-styles']) ) {

            headerType = data['heading-styles'];

        }

        headerElement = document.createElement(headerType);


        if (data && data.text) {

            headerElement.textContent = data.text;

        }

        headerElement.classList.add('ce-header');
        headerElement.setAttribute('data-placeholder', 'Заголовок');
        headerElement.contentEditable = true;

        return headerElement;

    }

    /**
     * Method to extract JSON data from HTML block
     */
    function save() {

        var data = {
            'heading-styles': headerType,
            'format': 'html',
            'text': headerElement.textContent || ''
        };

        return data;

    }

    /**
     * Settings panel content
     *  - - - - - - - - - - - - -
     * | настройки   H1  H2  H3  |
     *  - - - - - - - - - - - - -
     * @return {Element} element contains all settings
     */
    function makeSettings() {

        var holder  = document.createElement('div');

        holder.classList.add('cdx-plugin-settings--horisontal');

        var types   = {
                h2: 'H2',
                h3: 'H3',
                h4: 'H4'
            },
            selectTypeButton;

        /** Now add type selectors */
        for (var type in types) {

            selectTypeButton = document.createElement('SPAN');
            selectTypeButton.classList.add('cdx-plugin-settings__item');
            selectTypeButton.textContent = types[type];

            methods_.addSelectTypeClickListener(selectTypeButton, type);
            holder.appendChild(selectTypeButton);

        }

        return holder;

    }

    function validate(data) {

        if (data.text.trim() === '' || data['heading-styles'].trim() === '') {

            return false;

        }

        return true;

    }


    return {name, save, render, validate, makeSettings};

};

