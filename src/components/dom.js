/**
 * DOM manupulations helper
 */
export default class Dom {

    static get nodeTypes() {

        return {
            TAG     : 1,
            TEXT    : 3,
            COMMENT : 8,
            DOCUMENT_FRAGMENT: 11
        };

    }

    /**
     * Helper for making Elements with classname and attributes
     *
     * @param  {string} tagName           - new Element tag name
     * @param  {array|string} classNames  - list or name of CSS classname(s)
     * @param  {Object} attributes        - any attributes
     * @return {Element}
     */
    static make(tagName, classNames='', attributes={}) {

        var el = document.createElement(tagName);

        if ( Array.isArray(classNames) ) {

            el.classList.add(...classNames);

        } else if( classNames ) {

            el.classList.add(classNames);

        }

        for (let attrName in attributes) {

            el[attrName] = attributes[attrName];

        }

        return el;

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
    static find(el = document, selector) {

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
    static findAll(el = document, selector) {

        return el.querySelectorAll(selector);

    }

    static isNode(node) {

        return node && typeof node === 'object' && node.nodeType && node.nodeType === Dom.nodeTypes.TAG;

    }
};