/**
 * Codex Editor Notification Module
 *
 * @author Codex Team
 * @version 1.0
 */

module.exports = (function () {
  let notifications = {};

  let editor = this;

  var queue = [];

  var addToQueue = function (settings) {
    queue.push(settings);

    var index = 0;

    while ( index < queue.length && queue.length > 5) {
      if (queue[index].type == 'confirm' || queue[index].type == 'prompt') {
        index++;
        continue;
      }

      queue[index].close();
      queue.splice(index, 1);
    }
  };

  notifications.createHolder = function () {
    var holder = editor.modules.draw.node('DIV', 'cdx-notifications-block');

    editor.nodes.notifications = document.body.appendChild(holder);

    return holder;
  };


    /**
     * Error notificator. Shows block with message
     * @protected
     */
  notifications.errorThrown = function (errorMsg, event) {
    editor.modules.notifications.notification({message: 'This action is not available currently', type: event.type});
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
        /** Private vars and methods */
    var notification = null,
        cancel       = null,
        type         = null,
        confirm      = null,
        inputField   = null;

    var confirmHandler = function () {
      close();

      if (typeof confirm !== 'function' ) {
        return;
      }

      if (type == 'prompt') {
        confirm(inputField.value);
        return;
      }

      confirm();
    };

    var cancelHandler = function () {
      close();

      if (typeof cancel !== 'function' ) {
        return;
      }

      cancel();
    };


        /** Public methods */
    function create(settings) {
      if (!(settings && settings.message)) {
        editor.modules.core.log('Can\'t create notification. Message is missed');
        return;
      }

      settings.type = settings.type || 'alert';
      settings.time = settings.time*1000 || 10000;

      var wrapper = editor.modules.draw.node('DIV', 'cdx-notification'),
          message = editor.modules.draw.node('DIV', 'cdx-notification__message'),
          input = editor.modules.draw.node('INPUT', 'cdx-notification__input'),
          okBtn = editor.modules.draw.node('SPAN', 'cdx-notification__ok-btn'),
          cancelBtn = editor.modules.draw.node('SPAN', 'cdx-notification__cancel-btn');

      message.textContent = settings.message;
      okBtn.textContent = settings.okMsg || 'ОК';
      cancelBtn.textContent = settings.cancelMsg || 'Отмена';

      editor.modules.listeners.add(okBtn, 'click', confirmHandler);
      editor.modules.listeners.add(cancelBtn, 'click', cancelHandler);

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
      type         = settings.type;
      confirm      = settings.confirm;
      cancel       = settings.cancel;
      inputField   = input;

      if (settings.type != 'prompt' && settings.type != 'confirm') {
        window.setTimeout(close, settings.time);
      }
    };

    function send() {
      editor.nodes.notifications.appendChild(notification);
      inputField.focus();

      editor.nodes.notifications.classList.add('cdx-notification__notification-appending');

      window.setTimeout(function () {
        editor.nodes.notifications.classList.remove('cdx-notification__notification-appending');
      }, 100);

      addToQueue({type: type, close: close});
    };

    function close() {
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
});
