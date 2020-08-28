import { Notifier } from '../../../../types/api';
import { ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions } from 'codex-notifier';
import BaseApiModule from './base';

/**
 *
 */
export default class NotifierAPI extends BaseApiModule {
  /**
   * Available methods
   */
  public get methods(): Notifier {
    return {
      show: (options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions): void => this.show(options),
    };
  }

  /**
   * Show notification
   *
   * @param {NotifierOptions} options - message option
   */
  public show(options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions): void {
    return this.Editor.Notifier.show(options);
  }
}
