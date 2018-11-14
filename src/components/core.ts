import $ from './dom';
import _ from './utils';
import {EditorConfig, OutputData, SanitizerConfig, ToolSettings} from '../../types';

/**
 * @typedef {Core} Core - editor core class
 */

/**
 * Require Editor modules places in components/modules dir
 */
// eslint-disable-next-line
const context = require.context('./modules', true);

const modules = [];

context.keys().forEach((key) => {
  if (key.match(/^\.\/[^_][\w/]*\.([tj])s$/)) {
    modules.push(context(key));
  }
});

/**
 * @class Core
 *
 * @classdesc CodeX Editor core class
 *
 * @property this.config - all settings
 * @property this.moduleInstances - constructed editor components
 *
 * @type {Core}
 */
export default class Core {
  public config: EditorConfig;
  public moduleInstances: any;
  public isReady: Promise<void>;

  /**
   * @param {Configuration} config - user configuration
   *
   */
  constructor(config?: EditorConfig|string) {
    /**
     * @typedef {Object} EditorComponents
     * @property {BlockManager} BlockManager
     * @property {Tools} Tools
     * @property {Events} Events
     * @property {UI} UI
     * @property {Toolbar} Toolbar
     * @property {Toolbox} Toolbox
     * @property {BlockSettings} BlockSettings
     * @property {Renderer} Renderer
     * @property {InlineToolbar} InlineToolbar
     */
    this.moduleInstances = {};

    /**
     * Ready promise. Resolved if CodeX Editor is ready to work, rejected otherwise
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

        _.log('I\'m ready! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧');

        setTimeout(() => {
          /**
           * Resolve this.isReady promise
           */
          onReady();
        }, 500);
      })
      .catch((error) => {
        _.log(`CodeX Editor does not ready because of ${error}`, 'error');

        /**
         * Reject this.isReady promise
         */
        onFail(error);
      });
  }

  /**
   * Setting for configuration
   * @param {Configuration|string|undefined} config
   */
  set configuration(config: EditorConfig|string) {
    /**
     * Process zero-configuration or with only holderId
     */
    if (typeof config === 'string' || typeof config === 'undefined') {
      this.config = {
        holderId: config || 'codex-editor',
      };
    } else {
      this.config = config;
    }

    config = config as EditorConfig;

    /**
     * If initial Block's Tool was not passed, use the Paragraph Tool
     */
    this.config.initialBlock = config.initialBlock || 'paragraph';

    /**
     * Initial block type
     * Uses in case when there is no blocks passed
     * @type {{type: (*), data: {text: null}}}
     */
    const initialBlockData = {
      type : this.config.initialBlock,
      data : {},
    };

    this.config.placeholder = config.placeholder || 'write your story...';
    this.config.sanitizer = config.sanitizer || {
      p: true,
      b: true,
      a: true,
    } as SanitizerConfig;

    this.config.hideToolbar = config.hideToolbar ? config.hideToolbar : false;
    this.config.tools = config.tools || {};
    this.config.data = config.data || {} as OutputData;
    this.config.onReady = config.onReady || (() => {});
    this.config.onChange = config.onChange || (() => {});

    /**
     * Initialize Blocks to pass data to the Renderer
     */
    if (_.isEmpty(this.config.data)) {
      this.config.data = {} as OutputData;
      this.config.data.blocks = [ initialBlockData ];
    } else {
      if (!this.config.data.blocks || this.config.data.blocks.length === 0) {
        this.config.data.blocks = [ initialBlockData ];
      }
    }
  }

  /**
   * Returns private property
   * @returns {Configuration}
   */
  get configuration(): EditorConfig|string {
    return this.config;
  }

  /**
   * Checks for required fields in Editor's config
   * @returns {Promise<void>}
   */
  public async validate(): Promise<void> {
    /**
     * Check if holderId is not empty
     */
    if (!this.config.holderId) {
      throw Error('«holderId» param must being not empty');
    }

    /**
     * Check for a holder element's existence
     */
    if (!$.get(this.config.holderId)) {
      throw Error(`element with ID «${this.config.holderId}» is missing. Pass correct holder's ID.`);
    }

    /**
     * Check Tools for a class containing
     */
    for (const toolName in this.config.tools) {
      if (this.config.tools.hasOwnProperty(toolName)) {
        const tool = this.config.tools[toolName];

        if (!_.isFunction(tool) && !_.isFunction((tool as ToolSettings).class)) {
          throw Error(
            `Tool «${toolName}» must be a constructor function or an object with function in the «class» property`,
          );
        }
      }
    }
  }

  /**
   * Initializes modules:
   *  - make and save instances
   *  - configure
   */
  public init() {
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
   * Make modules instances and save it to the @property this.moduleInstances
   */
  public constructModules(): void {
    modules.forEach( (Module) => {
      try {
        /**
         * We use class name provided by displayName property
         *
         * On build, Babel will transform all Classes to the Functions so, name will always be 'Function'
         * To prevent this, we use 'babel-plugin-class-display-name' plugin
         * @see  https://www.npmjs.com/package/babel-plugin-class-display-name
         */
        this.moduleInstances[Module.displayName] = new Module({
          config : this.configuration,
        });
      } catch ( e ) {
        console.log('Module %o skipped because %o', Module, e);
      }
    });
  }

  /**
   * Modules instances configuration:
   *  - pass other modules to the 'state' property
   *  - ...
   */
  public configureModules(): void {
    for (const name in this.moduleInstances) {
      if (this.moduleInstances.hasOwnProperty(name)) {
        /**
         * Module does not need self-instance
         */
        this.moduleInstances[name].state = this.getModulesDiff(name);
      }
    }
  }

  /**
   * Return modules without passed name
   */
  public getModulesDiff( name ) {
    const diff = {};

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

  /**
   * Start Editor!
   *
   * Get list of modules that needs to be prepared and return a sequence (Promise)
   * @return {Promise}
   */
  public async start() {
    const modulesToPrepare = ['Tools', 'UI', 'BlockManager', 'Paste', 'DragNDrop', 'ModificationsObserver'];

    await modulesToPrepare.reduce(
      (promise, module) => promise.then(async () => {
        _.log(`Preparing ${module} module`, 'time');

        try {
          await this.moduleInstances[module].prepare();
        } catch (e) {
          _.log(`Module ${module} was skipped because of %o`, 'warn', e);
        }
        _.log(`Preparing ${module} module`, 'timeEnd');
      }),
      Promise.resolve(),
    );

    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }
}
