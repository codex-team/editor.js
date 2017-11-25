/**
 * @module eventDispatcher
 *
 * Has two important methods:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *
 * @version 1.0.0
 */
module.exports = class Events {

    /**
     * Module key name
     * @returns {string}
     */
    static get name() {

        return 'Events';

    }

    /**
     * @param Editor
     * @param Editor.modules {@link CodexEditor#moduleInstances}
     * @param Editor.config {@link CodexEditor#configuration}
     */
    set state(Editor) {

        this.Editor = Editor;

    }

    /**
     * @constructor
     *
     * @property {Object} subscribers - all subscribers grouped by event name
     */
    constructor() {

        this.subscribers = {};
        this.Editor = null;

    }

    /**
     * @param {String} eventName - event name
     * @param {Function} callback - subscriber
     */
    on(eventName, callback) {

        if (!(eventName in this.subscribers)) {

            this.subscribers[eventName] = [];

        }

        // group by events
        this.subscribers[eventName].push(callback);

    }

    /**
     * @param {String} eventName - event name
     * @param {Object} data - subscribers get this data when they were fired
     */
    emit(eventName, data) {

        this.subscribers[eventName].reduce(function (previousData, currentHandler) {

            let newData = currentHandler(previousData);

            return newData ? newData : previousData;

        }, data);

    }

    /**
     * Destroyer
     */
    destroy() {

        this.Editor = null;
        this.subscribers = null;

    }

};
