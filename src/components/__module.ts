import { EditorModules } from '../types-internal/editor-modules';
import { EditorConfig } from '../../types';
import { ModuleConfig } from '../types-internal/module-config';
import Listeners from './utils/listeners';
import EventsDispatcher from './utils/events';

/**
 * The type <T> of the Module generic.
 * It describes the structure of nodes used in modules.
 */
export type ModuleNodes = object;

/**
 * @abstract
 * @class      Module
 * @classdesc  All modules inherits from this class.
 *
 * @typedef {Module} Module
 * @property {object} config - Editor user settings
 * @property {EditorModules} Editor - List of Editor modules
 */
export default class Module<T extends ModuleNodes = {}> {
  /**
   * Each module can provide some UI elements that will be stored in this property
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public nodes: T = {} as any;

  /**
   * Editor modules list
   *
   * @type {EditorModules}
   */
  protected Editor: EditorModules;

  /**
   * Editor configuration object
   *
   * @type {EditorConfig}
   */
  protected config: EditorConfig;

  /**
   * Editor event dispatcher class
   */
  protected eventsDispatcher: EventsDispatcher;

  /**
   * Util for bind/unbind DOM event listeners
   */
  protected listeners: Listeners = new Listeners();

  /**
   * This object provides methods to push into set of listeners that being dropped when read-only mode is enabled
   */
  protected readOnlyMutableListeners = {
    /**
     * Assigns event listener on DOM element and pushes into special array that might be removed
     *
     * @param {EventTarget} element - DOM Element
     * @param {string} eventType - Event name
     * @param {Function} handler - Event handler
     * @param {boolean|AddEventListenerOptions} options - Listening options
     */
    on: (
      element: EventTarget,
      eventType: string,
      handler: (event: Event) => void,
      options: boolean | AddEventListenerOptions = false
    ): void => {
      this.mutableListenerIds.push(
        this.listeners.on(element, eventType, handler, options)
      );
    },

    /**
     * Clears all mutable listeners
     */
    clearAll: (): void => {
      for (const id of this.mutableListenerIds) {
        this.listeners.offById(id);
      }

      this.mutableListenerIds = [];
    },
  };

  /**
   * The set of listener identifiers which will be dropped in read-only mode
   */
  private mutableListenerIds: string[] = [];

  /**
   * @class
   *
   * @param {EditorConfig} config - Editor's config
   * @param {EventsDispatcher} eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    if (new.target === Module) {
      throw new TypeError('Constructors for abstract class Module are not allowed.');
    }

    this.config = config;
    this.eventsDispatcher = eventsDispatcher;
  }

  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  public set state(Editor: EditorModules) {
    this.Editor = Editor;
  }

  /**
   * Remove memorized nodes
   */
  public removeAllNodes(): void {
    for (const key in this.nodes) {
      const node = this.nodes[key];

      if (node instanceof HTMLElement) {
        node.remove();
      }
    }
  }

  /**
   * Returns true if current direction is RTL (Right-To-Left)
   */
  protected get isRtl(): boolean {
    return this.config.i18n.direction === 'rtl';
  }
}
