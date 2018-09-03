/**
 * @typedef {Core} Core - editor core class
 */

/**
 * Dynamically imported utils
 *
 * @typedef {Dom}   $      - {@link components/dom.js}
 * @typedef {Util}  _      - {@link components/utils.js}
 */

/**
 * Require Editor modules places in components/modules dir
 */
// eslint-disable-next-line
let modules = editorModules.map( module => require('./modules/' + module ));

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
  /**
   * @param {EditorConfig} config - user configuration
   *
   */
  constructor(config) {
    /**
     * Configuration object
     * @type {EditorConfig}
     */
    this.config = {};

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
      .then(() => {
        this.configuration = config;
      })
      .then(() => this.validate())
      .then(() => this.init())
      .then(() => this.start())
      .then(() => {
        _.log('I\'m ready! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧');

        setTimeout(() => {
          /**
           * Resolve this.isReady promise
           */
          onReady();
        }, 500);
      })
      .catch(error => {
        _.log(`CodeX Editor does not ready because of ${error}`, 'error');

        /**
         * Reject this.isReady promise
         */
        onFail(error);
      });
  }

  /**
   * Setting for configuration
   * @param {EditorConfig|string|null} config
   */
  set configuration(config) {
    /**
     * Process zero-configuration or with only holderId
     */
    if (typeof config === 'string' || typeof config === 'undefined') {
      config = {
        holderId: config
      };
    }

    /**
     * If initial Block's Tool was not passed, use the Paragraph Tool
     */
    this.config.initialBlock = config.initialBlock || 'paragraph';

    /**
     * Initial block type
     * Uses in case when there is no blocks passed
     * @type {{type: (*), data: {text: null}}}
     */
    let initialBlockData = {
      type : this.config.initialBlock,
      data : {}
    };

    this.config.holderId = config.holderId || 'codex-editor';
    this.config.placeholder = config.placeholder || 'write your story...';
    this.config.sanitizer = config.sanitizer || {
      p: true,
      b: true,
      a: true
    };

    this.config.hideToolbar = config.hideToolbar ? config.hideToolbar : false;
    this.config.tools = config.tools || {};
    this.config.data = config.data || {};
    this.config.onReady = config.onReady || function () {};

    /**
     * Initialize Blocks to pass data to the Renderer
     */
    if (_.isEmpty(this.config.data)) {
      this.config.data = {};
      this.config.data.blocks = [ initialBlockData ];
    } else {
      if (!this.config.data.blocks || this.config.data.blocks.length === 0) {
        this.config.data.blocks = [ initialBlockData ];
      }
    }
  }

  /**
   * Returns private property
   * @returns {EditorConfig}
   */
  get configuration() {
    return this.config;
  }

  /**
   * Checks for required fields in Editor's config
   * @returns {void|Promise<string>}
   */
  validate() {
    /**
     * Check if holderId is not empty
     */
    if (!this.config.holderId) {
      return Promise.reject('«holderId» param must being not empty');
    }

    /**
     * Check for a holder element's existence
     */
    if (!$.get(this.config.holderId)) {
      return Promise.reject(`element with ID «${this.config.holderId}» is missing. Pass correct holder's ID.`);
    }

    /**
     * Check Tools for a class containing
     */
    for (let toolName in this.config.tools) {
      const tool = this.config.tools[toolName];

      if (!_.isFunction(tool) && !_.isFunction(tool.class)) {
        return Promise.reject(`Tool «${toolName}» must be a constructor function or an object with that function in the «class» property`);
      }
    }
  }

  /**
   * Initializes modules:
   *  - make and save instances
   *  - configure
   */
  init() {
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
  constructModules() {
    modules.forEach( Module => {
      try {
        /**
         * We use class name provided by displayName property
         *
         * On build, Babel will transform all Classes to the Functions so, name will always be 'Function'
         * To prevent this, we use 'babel-plugin-class-display-name' plugin
         * @see  https://www.npmjs.com/package/babel-plugin-class-display-name
         */
        this.moduleInstances[Module.displayName] = new Module({
          config : this.configuration
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
  configureModules() {
    for(let name in this.moduleInstances) {
      /**
       * Module does not need self-instance
       */
      this.moduleInstances[name].state = this.getModulesDiff( name );
    }
  }

  /**
   * Return modules without passed name
   */
  getModulesDiff( name ) {
    let diff = {};

    for(let moduleName in this.moduleInstances) {
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
  async start() {
    const modulesToPrepare = ['Tools', 'UI', 'BlockManager', 'Paste'];

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
      Promise.resolve()
    );

    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }
};
