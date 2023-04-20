import { ModuleConfig } from '../../types-internal/module-config';
import Module from '../__module';
import * as _ from '../utils';

/**
 * Single entry point for Block mutation events
 */
export default class ModificationsObserver extends Module {
  /**
   * Flag shows onChange event is disabled
   */
  private disabled = false;
  private readonly mutationObserver: MutationObserver;

  /**
   *
   * @param root0
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.mutationObserver = new MutationObserver((mutations) => {
      this.onChange(mutations);
    });
  }

  /**
   * Enables onChange event
   */
  public enable(): void {
    this.mutationObserver.observe(
      this.Editor.UI.nodes.redactor,
      {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      }
    );
    this.disabled = false;
  }

  /**
   * Disables onChange event
   */
  public disable(): void {
    this.mutationObserver.disconnect();
  }

  /**
   * Call onChange event passed to Editor.js configuration
   *
   * @param event - some of our custom change events
   */
  public dispatchOnChange(event: CustomEvent): void {
    if (this.disabled || !_.isFunction(this.config.onChange)) {
      return;
    }

    this.config.onChange(this.Editor.API.methods, event);
  }

  /**
   * @param mutations
   */
  private onChange(mutations: MutationRecord[]): void {
    // if (this.disabled || !_.isFunction(this.config.onChange)) {
    //   return;
    // }

    // this.config.onChange(this.Editor.API.methods, event);

    this.eventsDispatcher.emit('dom changed', {
      mutations,
    });
  }


}
