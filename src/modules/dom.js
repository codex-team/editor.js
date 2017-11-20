module.exports = class Dom {

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