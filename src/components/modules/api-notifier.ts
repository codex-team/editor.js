import Module from '../__module';
import {ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions} from 'codex-notifier';

export default class NotifierAPI extends Module {

  /**
   * Available methods
   */
  get methods() {
    return {
      show: (options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions) => this.show(options),
    };
  }

  public show(options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions) {
    return this.Editor.Notifier.show(options);
  }
}
