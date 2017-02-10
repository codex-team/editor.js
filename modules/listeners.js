module.exports = function (listeners) {

    var allListeners = [];

    var search = function (element, listenerType, handler) {

        var allListenersOnElement = [];

        for (var i = 0; i < allListeners.length; i++) {

            var listener = allListeners[i];

            if (listener.element === element) {

                allListenersOnElement.push(listener);

            }

        }

        if (listenerType) {

            for (i = 0; i < allListenersOnElement.length; i++) {

                var listener = allListenersOnElement[i];

                if (listener.listenerType !== listenerType) {

                    allListenersOnElement.splice(i, 1);

                }

            }

        }

        if (handler) {

            for (i = 0; i < allListenersOnElement.length; i++) {

                var listener = allListenersOnElement[i];

                if (listener.handler !== handler) {

                    allListenersOnElement.splice(i, 1);

                }

            }

        }

        return allListenersOnElement;

    };

    listeners.add = function (element, listenerType, handler, isCapture) {

        element.addEventListener(listenerType, handler, isCapture);

        var data = {
            element: element,
            type: listenerType,
            handler: handler
        };

        var alreadyAddedListeners = search(element, listenerType, handler);

        if (alreadyAddedListeners.length == 0) {

            allListeners.push(data);

        }

    };

    listeners.remove = function (element, listenerType, handler) {

        element.removeEventListener(listenerType, handler);

        var existingListeners = search(element, listenerType, handler);

        for (var i = 0; i < existingListeners.length; i++) {

            var index = allListeners.indexOf(existingListeners[i]);

            if (index > 0) {

                allListeners.splice(index, 1);

            }

        }

    };

    listeners.removeAll = function () {

        allListeners.map(function (current) {

            listeners.remove(current.element, current.type, current.handler);

        });

    };

    listeners.get = function (element, listenerType, handler) {

        if (!element) {

            return allListeners;

        }

        return search(element, listenerType, handler);

    };

    return listeners;

}({});