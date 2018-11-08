import Module from '../__module';
import {ConfirmNotificationOptions, NotificationOptions, PromptNotificationOptions} from './notifier';

export default class NotifierAPI extends Module {

  /**
   * Available methods
   */
  get methods() {
    return {
      show: (options: NotificationOptions | ConfirmNotificationOptions | PromptNotificationOptions) => this.show(options),
    };
  }

  public show(options: NotificationOptions | ConfirmNotificationOptions | PromptNotificationOptions) {
    return this.Editor.Notifier.show(options);
  }
}
