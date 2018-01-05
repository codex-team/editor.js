/**
 * Codex Editor Listeners module
 *
 * @module Listeners
 *
 * Module-decorator for event listeners assignment
 *
 * @author Codex Team
 * @version 2.0.0
 */

/**
 * @typedef {Listeners} Listeners
 * @property {Array} allListeners
 */

export default class Listeners extends Module {

    /**
     * @constructor
     * @param {EditorConfig} config
     */
    constructor({config}) {

        super({config});
        this.allListeners = [];

    }

    /**
     * Assigns event listener on element
     *
     * @param {Element} element - DOM element that needs to be listened
     * @param {String} eventType - event type
     * @param {Function} handler - method that will be fired on event
     * @param {Boolean} useCapture - use event bubbling
     */
    on(element, eventType, handler, useCapture = false) {

        let assignedEventData = {
            element,
            eventType,
            handler,
            useCapture
        };

        let alreadyExist = this.findOne(element, eventType, handler);

        if (alreadyExist) return;

        this.allListeners.push(assignedEventData);
        element.addEventListener(eventType, handler, useCapture);

    }

    /**
     * Removes event listener from element
     *
     * @param {Element} element - DOM element that we removing listener
     * @param {String} eventType - event type
     * @param {Function} handler - remove handler, if element listens several handlers on the same event type
     * @param {Boolean} useCapture - use event bubbling
     */
    off(element, eventType, handler, useCapture = false) {

        let existingListeners = this.findAll(element, eventType, handler);

        for (let i = 0; i < existingListeners.length; i++) {

            let index = this.allListeners.indexOf(existingListeners[i]);

            if (index > 0) {

                this.allListeners.splice(index, 1);

            }

        }

        element.removeEventListener(eventType, handler, useCapture);


    }

    /**
     * Search methods
     *
     * byElement, byType and byHandler returns array of suitable listeners
     * one and all takes element, eventType, and handler and returns first (all) suitable listener
     */
    findByElement(element) {

        let listenersOnElement = [];

        for (let i = 0; i < this.allListeners.length; i++) {

            let listener = this.allListeners[i];

            if (listener.element === element) {

                listenersOnElement.push(listener);

            }

        }

        return listenersOnElement;

    }

    findByType(eventType) {

        let listenersWithType = [];

        for (let i = 0; i < this.allListeners.length; i++) {

            let listener = this.allListeners[i];

            if (listener.type === eventType) {

                listenersWithType.push(listener);

            }

        }

        return listenersWithType;

    }

    findByHandler(handler) {

        let listenersWithHandler = [];

        for (let i = 0; i < this.allListeners.length; i++) {

            let listener = this.allListeners[i];

            if (listener.handler === handler) {

                listenersWithHandler.push(listener);

            }

        }

        return listenersWithHandler;

    }

    findOne(element, eventType, handler) {

        let foundListeners = [];

        if (element)
            foundListeners = this.byElement(element);

        if (eventType)
            foundListeners = foundListeners.concat(this.byType(eventType));

        if (handler)
            foundListeners = foundListeners.concat(this.byHandler(handler));

        return foundListeners[0];

    }

    findAll(element, eventType, handler) {

        let foundListeners = [];

        if (element)
            foundListeners = this.byElement(element);

        if (eventType)
            foundListeners = foundListeners.concat(this.byType(eventType));

        if (handler)
            foundListeners = foundListeners.concat(this.byHandler(handler));

        return foundListeners;

    }

    removeAll() {

        this.allListeners.map( (current) => {

            this.off(current.element, current.type, current.handler);

        });

    }

}