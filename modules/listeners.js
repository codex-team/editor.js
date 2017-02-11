/**
 * Codex Editor Listeners module
 *
 * @author Codex Team
 * @version 1.0
 */

/**
 * Module-decorator for event listeners assignment
 */
module.exports = function (listeners) {

    var allListeners = [];

    /**
     * Search methods
     *
     * byElement, byType and byHandler returns array of suitable listeners
     * one and all takes element, eventType, and handler and returns first (all) suitable listener
     *
     */
    listeners.search = function () {

        var byElement = function (element, context) {

            var listenersOnElement = [];

            context = context || allListeners;

            for (var i = 0; i < context.length; i++) {

                var listener = context[i];

                if (listener.element === element) {

                    listenersOnElement.push(listener);

                }

            }

            return listenersOnElement;

        };

        var byType = function (eventType, context) {

            var listenersWithType = [];

            context = context || allListeners;

            for (var i = 0; i < context.length; i++) {

                var listener = context[i];

                if (listener.type === eventType) {

                    listenersWithType.push(listener);

                }

            }

            return listenersWithType;

        };

        var byHandler = function (handler, context) {

            var listenersWithHandler = [];

            context = context || allListeners;

            for (var i = 0; i < context.length; i++) {

                var listener = context[i];

                if (listener.handler === handler) {

                    listenersWithHandler.push(listener);

                }

            }

            return listenersWithHandler;

        };

        var one = function (element, eventType, handler) {

            var result = allListeners;

            if (element)
                result = byElement(element, result);

            if (eventType)
                result = byType(eventType, result);

            if (handler)
                result = byHandler(handler, result);

            return result[0];

        };

        var all = function (element, eventType, handler) {

            var result = allListeners;

            if (element)
                result = byElement(element, result);

            if (eventType)
                result = byType(eventType, result);

            if (handler)
                result = byHandler(handler, result);

            return result;

        };

        return {
            byElement   : byElement,
            byType      : byType,
            byHandler   : byHandler,
            one         : one,
            all         : all
        };

    }();

    listeners.add = function (element, eventType, handler, isCapture) {

        element.addEventListener(eventType, handler, isCapture);

        var data = {
            element: element,
            type: eventType,
            handler: handler
        };

        var alreadyAddedListener = listeners.search.one(element, eventType, handler);

        if (!alreadyAddedListener) {

            allListeners.push(data);

        }

    };

    listeners.remove = function (element, eventType, handler) {

        element.removeEventListener(eventType, handler);

        var existingListeners = listeners.search.all(element, eventType, handler);

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

    listeners.get = function (element, eventType, handler) {

        return listeners.search.all(element, eventType, handler);

    };

    return listeners;

}({});