import { BlockId } from '../../../types';
import { BlockMutationEvent, BlockMutationType } from '../../../types/events/block';
import { ModuleConfig } from '../../types-internal/module-config';
import Module from '../__module';
import { BlockChanged, FakeCursorAboutToBeToggled, FakeCursorHaveBeenSet, RedactorDomChanged } from '../events';
import * as _ from '../utils';

/**
 * We use map of block mutations to filter only unique events
 */
type UniqueBlockMutationKey = `block:${BlockId}:event:${BlockMutationType}`;

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
  private batchingTimeout: null | ReturnType<typeof setTimeout> = null;

  /**
   * Array of onChange events used to batch them
   *
   * Map is used to filter duplicated events related to the same block
   */
  private batchingOnChangeQueue = new Map<UniqueBlockMutationKey, BlockMutationEvent>();

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
      this.redactorChanged(mutations);
    });

    this.eventsDispatcher.on(BlockChanged, (payload) => {
      this.particularBlockChanged(payload.event);
    });

    /**
     * Mutex for fake cursor setting/removing operation
     */
    this.eventsDispatcher.on(FakeCursorAboutToBeToggled, () => {
      this.disable();
    });

    this.eventsDispatcher.on(FakeCursorHaveBeenSet, () => {
      this.enable();
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
  private particularBlockChanged(event: BlockMutationEvent): void {
    if (this.disabled || !_.isFunction(this.config.onChange)) {
      return;
    }

    this.batchingOnChangeQueue.set(`block:${event.detail.target.id}:event:${event.type as BlockMutationType}`, event);

    if (this.batchingTimeout) {
      clearTimeout(this.batchingTimeout);
    }

    this.batchingTimeout = setTimeout(() => {
      let eventsToEmit;

      /**
       * Ih we have only 1 event in a queue, unwrap it
       */
      if (this.batchingOnChangeQueue.size === 1) {
        eventsToEmit = this.batchingOnChangeQueue.values().next().value;
      } else {
        eventsToEmit = Array.from(this.batchingOnChangeQueue.values());
      }

      if (this.config.onChange) {
        this.config.onChange(this.Editor.API.methods, eventsToEmit);
      }

      this.batchingOnChangeQueue.clear();
    }, this.batchTime);
  }

  /**
   * Fired on every blocks wrapper dom change
   *
   * @param mutations - mutations happened
   */
  private redactorChanged(mutations: MutationRecord[]): void {
    this.eventsDispatcher.emit(RedactorDomChanged, {
      mutations,
    });
  }
}
