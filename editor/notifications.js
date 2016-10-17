/**
 * Module which extends notifications and make different animations for logs
 *
 * @author Codex team
 * @version 1.0.0
 */

var notifications = (function() {

    /**
     * @protected
     *
     * Error notificator. Shows block with message
     *
     */
    var errorThrown = function(errorMsg, event) {

        cEditor.notifications.send('This action is not available currently', event.type, false);

    };

    /**
     * @protected
     *
     * Appends notification with different types
     * @param message {string} - Error or alert message
     * @param type {string} - Type of message notification. Ex: Error, Warning, Danger ...
     * @param append {boolean} - can be True or False when notification should be inserted after
     */
    var send = function(message, type, append) {

        var notification = cEditor.draw.block('div');

        notification.textContent = message;
        notification.classList.add('ce_notification-item', 'ce_notification-' + type, 'flipInX');

        if (!append) {
            cEditor.nodes.notifications.innerHTML = '';
        }

        cEditor.nodes.notifications.appendChild(notification);

        setTimeout(function () {
            notification.remove();
        }, 3000);

    };

    return {
        errorThrown : errorThrown,
        send        : send
    };

})();

module.exports = notifications;
