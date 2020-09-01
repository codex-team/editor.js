import { Notifier } from '../../../../types/api';
import { ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions } from 'codex-notifier';
import ApiModule from './base';

/**
 *
 */
export default class NotifierAPI extends ApiModule {
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
