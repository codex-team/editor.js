module.exports = class Dom {

    /**
     * Module key name
     * @returns {string}
     */
    static get name() {

        return 'dom';

    };


    /**
     * @param Editor
     * @param Editor.modules {@link Tools#list}
     * @param Editor.config {@link CodexEditor#configuration}
     * @param Editor
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * Draws element with class and properties
     *
     * @param {String} el - Element name
     * @param {Array} classList - array of CSS classes
     * @param {Object} properties - list of objects/properties
     *
     * @returns {Element}
     */
    make(el, classList, properties) {

        let element = document.createElement(el);

        classList.forEach(function (className) {

            element.classList.add(className);

        });

        for(property in properties) {

            element.property = properties[property];

        }

        return element;

    }

    /**
     * Selector Decorator
     *
     * Returns first match
     *
     * @param {Element} el - element we searching inside. Default - DOM Document
     * @param {String} selector - searching string
     *
     * @returns {Element}
     */
    find(el = document, selector) {

        return el.querySelector(selector);

    }

    /**
     * Selector Decorator.
     *
     * Returns all matches
     *
     * @param {Element} el - element we searching inside. Default - DOM Document
     * @param {String} selector - searching string
     * @returns {NodeList}
     */
    findAll(el = document, selector) {

        return el.querySelectorAll(selector);

    }

};