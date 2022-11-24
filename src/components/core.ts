import $ from './dom';
import * as _ from './utils';
import { EditorConfig, SanitizerConfig } from '../../types';
import { EditorModules } from '../types-internal/editor-modules';
import I18n from './i18n';
import { CriticalError } from './errors/critical';
import EventsDispatcher from './utils/events';

/**
 * @typedef {Core} Core - editor core class
 */

/**
 * Require Editor modules places in components/modules dir
 */
const contextRequire = require.context('./modules', true);

const modules = [];

contextRequire.keys().forEach((filename) => {
  /**
   * Include files if:
   * - extension is .js or .ts
   * - does not starts with _
   */
  if (filename.match(/^\.\/[^_][\w/]*\.([tj])s$/)) {
    modules.push(contextRequire(filename));
  }
});

/**
 * @class Core
 * @classdesc Editor.js core class
 * @property {EditorConfig} config - all settings
 * @property {EditorModules} moduleInstances - constructed editor components
 * @type {Core}
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
   * Event Dispatcher util
   */
  private eventsDispatcher: EventsDispatcher = new EventsDispatcher();

  /**
   * @param {EditorConfig} config - user configuration
   */
  constructor(config?: EditorConfig|string) {
    /**
     * Ready promise. Resolved if Editor.js is ready to work, rejected otherwise
     */
    let onReady, onFail;

    this.isReady = new Promise((resolve, reject) => {
      onReady = resolve;
      onFail = reject;
    });

    Promise.resolve()
      .then(async () => {
        this.configuration = config;

        await this.validate();
        await this.init();
        await this.start();

        _.logLabeled('I\'m ready! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'log', '', 'color: #E24A75');

        setTimeout(async () => {
          await this.render();

          if ((this.configuration as EditorConfig).autofocus) {
            const { BlockManager, Caret } = this.moduleInstances;

            Caret.setToBlock(BlockManager.blocks[0], Caret.positions.START);
            BlockManager.highlightCurrentNode();
          }

          /**
           * Remove loader, show content
           */
          this.moduleInstances.UI.removeLoader();

          /**
           * Resolve this.isReady promise
           */
          onReady();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, 500);
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
  public get configuration(): EditorConfig|string {
    return this.config;
  }

  /**
   * Checks for required fields in Editor's config
   *
   * @returns {Promise<void>}
   */
  public async validate(): Promise<void> {
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
    modules.forEach((module) => {
      /**
       * If module has non-default exports, passed object contains them all and default export as 'default' property
       */
      const Module = _.isFunction(module) ? module : module.default;

      try {
        /**
         * We use class name provided by displayName property
         *
         * On build, Babel will transform all Classes to the Functions so, name will always be 'Function'
         * To prevent this, we use 'babel-plugin-class-display-name' plugin
         *
         * @see  https://www.npmjs.com/package/babel-plugin-class-display-name
         */
        this.moduleInstances[Module.displayName] = new Module({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher,
        });
      } catch (e) {
        _.log(`Module ${Module.displayName} skipped because`, 'error', e);
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
