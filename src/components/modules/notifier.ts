import Module from '../__module';

/**
 * Use external package module for notifications
 *
 * @see https://github.com/codex-team/js-notifier
 */
import notifier, {ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions} from 'codex-notifier';

/**
 * Notifier module
 */
export default class Notifier extends Module {

  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions} options
   */
  public show(options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions) {
    notifier.show(options);
  }
}
