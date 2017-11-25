
module.exports = class Events {

    constructor() {

        this.subscribers = {};

    }

    on(eventName, callback) {

        if (!(eventName in this.subscribers)) {

            this.subscribers[eventName] = [];

        }

        // group by events
        this.subscribers[eventName].push(callback);

    }

    emit(eventName, data) {

        this.subscribers[eventName].reduce(function (previousData, currentHandler) {

            let newData = currentHandler(previousData);

            return newData ? newData : previousData;

        }, data);

    }

};
