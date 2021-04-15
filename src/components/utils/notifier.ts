/**
 * Use external package module for notifications
 *
 * @see https://github.com/codex-team/js-notifier
 */
import notifier, { ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions } from 'codex-notifier';

/**
 * Util for showing notifications
 */
export default class Notifier {
  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions} options - notification options
   */
  public show(options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions): void {
    notifier.show(options);
  }
}
