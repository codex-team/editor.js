import $ from './dom';
import * as _ from './utils';
import { EditorConfig, SanitizerConfig } from '../../types';
import { EditorModules } from '../types-internal/editor-modules';
import I18n from './i18n';
import { CriticalError } from './errors/critical';
import EventsDispatcher from './utils/events';
import Modules from './modules';
import { EditorEventMap } from './events';

/**
 * Editor.js core class. Bootstraps modules.
 */
export default class Core {
  /**
   * Editor configuration passed by user to the constructor
   */
  public config: EditorConfig;

  /**
   * Object with core modules instances
   */
  public moduleInstances: EditorModules = {} as EditorModules;

  /**
   * Promise that resolves when all core modules are prepared and UI is rendered on the page
   */
  public isReady: Promise<void>;

  /**
   * Common Editor Event Bus
   */
  private eventsDispatcher: EventsDispatcher<EditorEventMap> = new EventsDispatcher();

  /**
   * @param {EditorConfig} config - user configuration
   */
  constructor(config?: EditorConfig|string) {
    /**
     * Ready promise. Resolved if Editor.js is ready to work, rejected otherwise
     */
    let onReady: (value?: void | PromiseLike<void>) => void;
    let onFail: (reason?: unknown) => void;

    this.isReady = new Promise((resolve, reject) => {
      onReady = resolve;
      onFail = reject;
    });

    Promise.resolve()
      .then(async () => {
        this.configuration = config;

        this.validate();
        this.init();
        await this.start();
        await this.render();

        const { BlockManager, Caret, UI, ModificationsObserver } = this.moduleInstances;

        UI.checkEmptiness();
        ModificationsObserver.enable();

        if ((this.configuration as EditorConfig).autofocus) {
          Caret.setToBlock(BlockManager.blocks[0], Caret.positions.START);
        }

        onReady();
      })
      .catch((error) => {
        _.log(`Editor.js is not ready because of ${error}`, 'error');

        /**
         * Reject this.isReady promise
         */
        onFail(error);
      });
  }

  /**
   * Setting for configuration
   *
   * @param {EditorConfig|string} config - Editor's config to set
   */
  public set configuration(config: EditorConfig|string) {
    /**
     * Place config into the class property
     *
     * @type {EditorConfig}
     */
    if (_.isObject(config)) {
      this.config = {
        ...config,
      };
    } else {
      /**
       * Process zero-configuration or with only holderId
       * Make config object
       */
      this.config = {
        holder: config,
      };
    }

    /**
     * If holderId is preset, assign him to holder property and work next only with holder
     */
    _.deprecationAssert(!!this.config.holderId, 'config.holderId', 'config.holder');
    if (this.config.holderId && !this.config.holder) {
      this.config.holder = this.config.holderId;
      this.config.holderId = null;
    }

    /**
     * If holder is empty then set a default value
     */
    if (this.config.holder == null) {
      this.config.holder = 'editorjs';
    }

    if (!this.config.logLevel) {
      this.config.logLevel = _.LogLevels.VERBOSE;
    }

    _.setLogLevel(this.config.logLevel);

    /**
     * If default Block's Tool was not passed, use the Paragraph Tool
     */
    _.deprecationAssert(Boolean(this.config.initialBlock), 'config.initialBlock', 'config.defaultBlock');
    this.config.defaultBlock = this.config.defaultBlock || this.config.initialBlock || 'paragraph';

    /**
     * Height of Editor's bottom area that allows to set focus on the last Block
     *
     * @type {number}
     */
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    this.config.minHeight = this.config.minHeight !== undefined ? this.config.minHeight : 300;

    /**
     * Default block type
     * Uses in case when there is no blocks passed
     *
     * @type {{type: (*), data: {text: null}}}
     */
    const defaultBlockData = {
      type: this.config.defaultBlock,
      data: {},
    };

    this.config.placeholder = this.config.placeholder || false;
    this.config.sanitizer = this.config.sanitizer || {
      p: true,
      b: true,
      a: true,
    } as SanitizerConfig;

    this.config.hideToolbar = this.config.hideToolbar ? this.config.hideToolbar : false;
    this.config.tools = this.config.tools || {};
    this.config.i18n = this.config.i18n || {};
    this.config.data = this.config.data || { blocks: [] };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.config.onReady = this.config.onReady || ((): void => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.config.onChange = this.config.onChange || ((): void => {});
    this.config.inlineToolbar = this.config.inlineToolbar !== undefined ? this.config.inlineToolbar : true;

    /**
     * Initialize default Block to pass data to the Renderer
     */
    if (_.isEmpty(this.config.data) || !this.config.data.blocks || this.config.data.blocks.length === 0) {
      this.config.data = { blocks: [ defaultBlockData ] };
    }

    this.config.readOnly = this.config.readOnly as boolean || false;

    /**
     * Adjust i18n
     */
    if (this.config.i18n?.messages) {
      I18n.setDictionary(this.config.i18n.messages);
    }

    /**
     * Text direction. If not set, uses ltr
     */
    this.config.i18n.direction = this.config.i18n?.direction || 'ltr';
  }

  /**
   * Returns private property
   *
   * @returns {EditorConfig}
   */
  public get configuration(): EditorConfig {
    return this.config;
  }

  /**
   * Checks for required fields in Editor's config
   */
  public validate(): void {
    const { holderId, holder } = this.config;

    if (holderId && holder) {
      throw Error('«holderId» and «holder» param can\'t assign at the same time.');
    }

    /**
     * Check for a holder element's existence
     */
    if (_.isString(holder) && !$.get(holder)) {
      throw Error(`element with ID «${holder}» is missing. Pass correct holder's ID.`);
    }

    if (holder && _.isObject(holder) && !$.isElement(holder)) {
      throw Error('«holder» value must be an Element node');
    }
  }

  /**
   * Initializes modules:
   *  - make and save instances
   *  - configure
   */
  public init(): void {
    /**
     * Make modules instances and save it to the @property this.moduleInstances
     */
    this.constructModules();

    /**
     * Modules configuration
     */
    this.configureModules();
  }

  /**
   * Start Editor!
   *
   * Get list of modules that needs to be prepared and return a sequence (Promise)
   *
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    const modulesToPrepare = [
      'Tools',
      'UI',
      'BlockManager',
      'Paste',
      'BlockSelection',
      'RectangleSelection',
      'CrossBlockSelection',
      'ReadOnly',
    ];

    await modulesToPrepare.reduce(
      (promise, module) => promise.then(async () => {
        // _.log(`Preparing ${module} module`, 'time');

        try {
          await this.moduleInstances[module].prepare();
        } catch (e) {
          /**
           * CriticalError's will not be caught
           * It is used when Editor is rendering in read-only mode with unsupported plugin
           */
          if (e instanceof CriticalError) {
            throw new Error(e.message);
          }
          _.log(`Module ${module} was skipped because of %o`, 'warn', e);
        }
        // _.log(`Preparing ${module} module`, 'timeEnd');
      }),
      Promise.resolve()
    );
  }

  /**
   * Render initial data
   */
  private render(): Promise<void> {
    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }

  /**
   * Make modules instances and save it to the @property this.moduleInstances
   */
  private constructModules(): void {
    Object.entries(Modules).forEach(([key, module]) => {
      try {
        this.moduleInstances[key] = new module({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher,
        });
      } catch (e) {
        _.log('[constructModules]', `Module ${key} skipped because`, 'error', e);
      }
    });
  }

  /**
   * Modules instances configuration:
   *  - pass other modules to the 'state' property
   *  - ...
   */
  private configureModules(): void {
    for (const name in this.moduleInstances) {
      if (Object.prototype.hasOwnProperty.call(this.moduleInstances, name)) {
        /**
         * Module does not need self-instance
         */
        this.moduleInstances[name].state = this.getModulesDiff(name);
      }
    }
  }

  /**
   * Return modules without passed name
   *
   * @param {string} name - module for witch modules difference should be calculated
   */
  private getModulesDiff(name: string): EditorModules {
    const diff = {} as EditorModules;

    for (const moduleName in this.moduleInstances) {
      /**
       * Skip module with passed name
       */
      if (moduleName === name) {
        continue;
      }
      diff[moduleName] = this.moduleInstances[moduleName];
    }

    return diff;
  }
}
