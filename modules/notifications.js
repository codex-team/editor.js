/**
 * Codex Editor Notification Module
 *
 * @author Codex Team
 * @version 1.0
 */
let editor = codex.editor;

var notifications = (function (notifications) {

    /**
     * Error notificator. Shows block with message
     * @protected
     */
    notifications.errorThrown = function (errorMsg, event) {

        editor.notifications.send('This action is not available currently', event.type, false);

    };

    /**
     * Appends notification with different types
     * @param message {string} - Error or alert message
     * @param type {string} - Type of message notification. Ex: Error, Warning, Danger ...
     * @param append {boolean} - can be True or False when notification should be inserted after
     */
    notifications.send = function (message, type, append) {

        var notification = editor.draw.block('div');

        notification.textContent = message;
        notification.classList.add('ce_notification-item', 'ce_notification-' + type, 'flipInX');

        if (!append) {

            editor.nodes.notifications.innerHTML = '';

        }

        editor.nodes.notifications.appendChild(notification);

        setTimeout(function () {

            notification.remove();

        }, 3000);

    };

    return notifications;

})({});

module.exports = notifications;