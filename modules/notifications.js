var codex = require('../editor');

var notifications = (function(notifications) {

    /**
     * Error notificator. Shows block with message
     * @protected
     */
    notifications.errorThrown = function(errorMsg, event) {

        codex.notifications.send('This action is not available currently', event.type, false);

    },

    /**
     * Appends notification with different types
     * @param message {string} - Error or alert message
     * @param type {string} - Type of message notification. Ex: Error, Warning, Danger ...
     * @param append {boolean} - can be True or False when notification should be inserted after
     */
    notifications.send = function(message, type, append) {

        var notification = codex.draw.block('div');

        notification.textContent = message;
        notification.classList.add('ce_notification-item', 'ce_notification-' + type, 'flipInX');

        if (!append) {
            codex.nodes.notifications.innerHTML = '';
        }

        codex.nodes.notifications.appendChild(notification);

        setTimeout(function () {
            notification.remove();
        }, 3000);

    };

    return notifications;

})({});

codex.notifications = notifications;
module.exports = notifications;