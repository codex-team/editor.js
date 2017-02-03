/**
 * Codex Editor Notification Module
 *
 * @author Codex Team
 * @version 1.0
 */
let editor = codex.editor;

module.exports = (function (notifications) {

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

        window.setTimeout(function () {

            notification.remove();

        }, 3000);

    };

    notifications.confirm = function (settings) {

        var confirm   = editor.draw.node('DIV', 'ce-notification-confirm'),
            message   = editor.draw.node('DIV', 'ce-notification-confirm__message'),
            okBtn     = editor.draw.node('SPAN', 'ce-notification-confirm__ok-btn'),
            cancelBtn = editor.draw.node('SPAN', 'ce-notification-confirm__ok-btn');

        message.textContent   = settings.message;
        okBtn.textContent     = settings.okMsg || 'Ok';
        cancelBtn.textContent = settings.cancelMsg || 'Cancel';

        okBtn.addEventListener('click', settings.confirm);
        cancelBtn.addEventListener('click', settings.cancel);

        okBtn.addEventListener('click', function () {

            confirm.remove();

        });
        cancelBtn.addEventListener('click', function () {

            confirm.remove();

        });



        confirm.appendChild(message);
        confirm.appendChild(okBtn);
        confirm.appendChild(cancelBtn);


        if (!settings.append) {

            editor.nodes.notifications.innerHTML = '';

        }

        editor.nodes.notifications.appendChild(confirm);

    };

    return notifications;

})({});