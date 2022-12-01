import { Notifier as INotifier } from '../../../../types/api';
import Notifier from '../../utils/notifier';
import { ConfirmNotifierOptions, NotifierOptions, PromptNotifierOptions } from 'codex-notifier';
import Module from '../../__module';
import { ModuleConfig } from '../../../types-internal/module-config';

/**
 *
 */
export default class NotifierAPI extends Module {
  /**
   * Notifier utility Instance
   */
  private notifier: Notifier;

  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.notifier = new Notifier();
  }

  /**
   * Available methods
   */
  public get methods(): INotifier {
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
    return this.notifier.show(options);
  }
}
