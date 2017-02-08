/**
 * Codex Editor Notification Module
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function (notifications) {

    let editor = codex.editor;

    var queue = [];

    var addToQueue = function (closeNotification) {

        queue.push(closeNotification);

        if (queue.length > 5) {

            var closeFirst = queue.shift();

            closeFirst();

        }

    };

    /**
     * Error notificator. Shows block with message
     * @protected
     */
    notifications.errorThrown = function (errorMsg, event) {

        editor.notifications.notification({message: 'This action is not available currently', type: event.type});

    };

    /**
     *
     * Appends notification
     *
     *  settings = {
     *      type        - notification type (reserved types: alert, confirm, prompt). Just add class 'cdx-notification-'+type
     *      message     - notification message
     *      okMsg       - confirm button text (default - 'Ok')
     *      cancelBtn   - cancel button text (default - 'Cancel'). Only for confirm and prompt types
     *      confirm     - function-handler for ok button click
     *      cancel      - function-handler for cancel button click. Only for confirm and prompt types
     *      time        - time (in seconds) after which notification will close (default - 10s)
     *  }
     *
     * @param settings
     */
    notifications.notification = function (constructorSettings) {

        var notification = null,
            cancel       = null,
            inputField   = null;

        var create = function (settings) {

            if (!(settings && settings.message)) {

                editor.core.log('Can\'t create notification. Message is missed');
                return;

            }

            settings.type = settings.type || 'alert';
            settings.time = settings.time*1000 || 10000;

            var wrapper = editor.draw.node('DIV', 'cdx-notification'),
                message = editor.draw.node('DIV', 'cdx-notification__message'),
                input = editor.draw.node('INPUT', 'cdx-notification__input'),
                okBtn = editor.draw.node('SPAN', 'cdx-notification__ok-btn'),
                cancelBtn = editor.draw.node('SPAN', 'cdx-notification__cancel-btn');

            message.textContent = settings.message;
            okBtn.textContent = settings.okMsg || 'ОК';
            cancelBtn.textContent = settings.cancelMsg || 'Отмена';

            okBtn.addEventListener('click', settings.confirm);
            cancelBtn.addEventListener('click', settings.cancel);

            okBtn.addEventListener('click', close);
            cancelBtn.addEventListener('click', close);


            wrapper.appendChild(message);

            if (settings.type == 'prompt') {

                wrapper.appendChild(input);

            }

            wrapper.appendChild(okBtn);

            if (settings.type == 'prompt' || settings.type == 'confirm') {

                wrapper.appendChild(cancelBtn);

            }

            wrapper.classList.add('cdx-notification-' + settings.type);
            wrapper.dataset.type = settings.type;

            notification = wrapper;
            cancel       = settings.cancel;
            inputField   = input;

            window.setTimeout(close, settings.time);

        };

        var send = function () {

            editor.nodes.notifications.appendChild(notification);
            inputField.focus();

            editor.nodes.notifications.classList.add('cdx-notification__notification-appending');

            window.setTimeout(function () {

                editor.nodes.notifications.classList.remove('cdx-notification__notification-appending');

            }, 100);

            addToQueue(close);

        };

        var close = function () {

            if (cancel) {

                cancel();

            }

            notification.remove();

        };

        if (constructorSettings) {

            create(constructorSettings);
            send();

        }

        return {
            create: create,
            send: send,
            close: close
        };

    };

    notifications.clear = function () {

        editor.nodes.notifications.innerHTML = '';
        queue = [];

    };

    return notifications;

})({});