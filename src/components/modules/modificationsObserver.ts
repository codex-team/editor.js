import { BlockId } from '../../../types';
import { BlockMutationEvent, BlockMutationType } from '../../../types/events/block';
import { ModuleConfig } from '../../types-internal/module-config';
import Module from '../__module';
import { RedactorDomChanged } from '../events';
import * as _ from '../utils';

/**
 * @todo remove listener after block deletion
 * @todo testcase: batching
 * @todo testcase: batching should filter same events
 */

/**
 * Single entry point for Block mutation events
 */
export default class ModificationsObserver extends Module {
  /**
   * Flag shows onChange event is disabled
   */
  private disabled = false;

  /**
   * Blocks wrapper mutation observer instance
   */
  private readonly mutationObserver: MutationObserver;

  /**
   * Timeout used to batched several events in a single onChange call
   */
  private batchingTimeout = null;

  /**
   * Array of onChange events used to batch them
   *
   * Map is used to filter duplicated events related to the same block
   */
  private batchingOnChangeQueue: Map<`block:${BlockId}:event:${BlockMutationType}`, BlockMutationEvent> = new Map();

  /**
   * Fired onChange events will be batched by this time
   */
  private readonly batchTime = 400;

  /**
   * Prepare the module
   *
   * @param options - options used by the modification observer module
   * @param options.config - Editor configuration object
   * @param options.eventsDispatcher - common Editor event bus
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
    this.disabled = true;
  }

  /**
   * Call onChange event passed to Editor.js configuration
   *
   * @param event - some of our custom change events
   */
  public dispatchOnChange(event: BlockMutationEvent): void {
    if (this.disabled || !_.isFunction(this.config.onChange)) {
      return;
    }

    this.batchingOnChangeQueue.set(`block:${event.detail.target.id}:event:${event.type}`, event);

    if (this.batchingTimeout) {
      clearTimeout(this.batchingTimeout);
    }

    this.batchingTimeout = setTimeout(() => {
      if (this.batchingOnChangeQueue.size === 1) {
        this.config.onChange(this.Editor.API.methods, this.batchingOnChangeQueue.values().next().value);
      } else {
        this.config.onChange(this.Editor.API.methods, Array.from(this.batchingOnChangeQueue.values()));
      }

      this.batchingOnChangeQueue.clear();
    }, this.batchTime);
  }

  /**
   * Fired on every blocks wrapper dom change
   *
   * @param mutations - mutations happened
   */
  private onChange(mutations: MutationRecord[]): void {
    this.eventsDispatcher.emit(RedactorDomChanged, {
      mutations,
    });
  }
}
