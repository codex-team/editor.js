import Module from '../__module';

/**
 * Use external package module for notifications
 *
 * @see https://github.com/codex-team/js-notifier
 */
import notifier from 'codex-notifier';

/**
 * Notifier module
 */
export default class Notifier extends Module {

  /**
   * Show web notification
   *
   * @param {NotificationOptions | ConfirmNotificationOptions | PromptNotificationOptions} options
   */
  public show(options: NotificationOptions | ConfirmNotificationOptions  |PromptNotificationOptions) {
    notifier.show(options);
  }
}

/**
 * Define base options interface for notifications
 *
 * @see https://github.com/codex-team/js-notifier#general-properties
 */
export interface NotificationOptions {
  /**
   * Notification message (can contains HTML)
   */
  message: string;

  /**
   * Type of notification:
   * - 'alert' (default)
   * - 'confirm'
   * - 'prompt'
   */
  type?: string;

  /**
   * Add class `cdx-notify--${style}` to popup
   * We have some default styles: 'success' and 'error'
   */
  style?: string;

  /**
   * Notification expire time in ms (8s by default)
   * Only 'alert' notifies expires
   */
  time?: number;
}

/**
 * Confirm notification options
 */
export interface ConfirmNotificationOptions extends NotificationOptions {
  /**
   * Text for confirmation button
   * 'Confirm' by default
   */
  okText: string;

  /**
   * Confirm button pressing callback
   * @param {MouseEvent} event
   */
  okHandler: (event: MouseEvent) => void;

  /**
   * Text for cancel button
   * 'Cancel' by default
   */
  cancelText: string;

  /**
   * Cancel button or cross button pressing callback
   * @param {MouseEvent} event
   */
  cancelHandler: (event: MouseEvent) => void;
}

/**
 * Prompt notification options
 */
export interface PromptNotificationOptions extends NotificationOptions {
  /**
   * Text for the Submit button
   * 'Ok' by default
   */
  okText?: string;

  /**
   * Submit button pressing callback
   * Gets input's value as a parameter
   * @param {string} value
   */
  okHandler: (value: string) => void;

  /**
   * Cross button pressing callback
   * @param {MouseEvent} event
   */
  cancelHandler?: (event: MouseEvent) => void;

  /**
   * Type of input
   * 'text' by default
   */
  inputType?: string;

  /**
   * Input placeholder
   */
  placeholder?: string;

  /**
   * Input default value
   */
  default?: string;
}
