/**
 * @module eventDispatcher
 *
 * Has two important methods:
 *    - {Function} on - appends subscriber to the event. If event doesn't exist - creates new one
 *    - {Function} emit - fires all subscribers with data
 *
 * @version 1.0.0
 *
 * @typedef {Events} Events
 * @property {Object} subscribers - all subscribers grouped by event name
 */
export default class Events extends Module {

    /**
     * @constructor
     */
    constructor(config) {

        super(config);
        this.subscribers = {};

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
     * clears subsribers list
     */
    destroy() {

        this.subscribers = null;

    }

}