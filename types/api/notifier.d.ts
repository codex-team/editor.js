import {ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions} from 'codex-notifier';

/**
 * Notifier API
 */
export interface Notifier {

  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions}
   */
  show: (options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions) => void;
}
