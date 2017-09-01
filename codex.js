/**
 *
 * Codex Editor
 *
 * @author Codex Team
 */

module.exports = (function (userSettings) {
  'use strict';

  let self = this;

  self.version = VERSION;
  self.scriptPrefix = 'cdx-script-';



  self.modules = {
    core: require('./modules/core'),
    tools: require('./modules/tools'),
    ui: require('./modules/ui'),
    transport: require('./modules/transport'),
    renderer: require('./modules/renderer'),
    saver: require('./modules/saver'),
    content: require('./modules/content'),
    toolbar: require('./modules/toolbar/toolbar'),
    callback: require('./modules/callbacks'),
    draw: require('./modules/draw'),
    caret: require('./modules/caret'),
    notifications: require('./modules/notifications'),
    parser: require('./modules/parser'),
    sanitizer: require('./modules/sanitizer'),
    listeners: require('./modules/listeners'),
    destroyer: require('./modules/destroyer'),
    paste: require('./modules/paste'),
  };

  for (let module in self.modules) {
    self.modules[module] = self.modules[module].call(self);
  }


    /**
     * @public
     * holds initial settings
     */
  self.settings = {
    tools     : ['paragraph', 'header', 'picture', 'list', 'quote', 'code', 'twitter', 'instagram', 'smile'],
    holderId  : 'codex-editor',

        // Type of block showing on empty editor
    initialBlockPlugin: 'paragraph'
  };

    /**
     * public
     *
     * Static nodes
     */
  self.nodes = {
    holder            : null,
    wrapper           : null,
    toolbar           : null,
    inlineToolbar     : {
      wrapper : null,
      buttons : null,
      actions : null
    },
    toolbox           : null,
    notifications     : null,
    plusButton        : null,
    showSettingsButton: null,
    showTrashButton   : null,
    blockSettings     : null,
    pluginSettings    : null,
    defaultSettings   : null,
    toolbarButtons    : {}, // { type : DomEl, ... }
    redactor          : null
  };

    /**
     * @public
     *
     * Output state
     */
  self.state = {
    jsonOutput  : [],
    blocks      : [],
    inputs      : []
  };

    /**
    * @public
    * Editor plugins
    */
  self.tools = {};

    /**
     * Initialization
     * @uses Promise cEditor.core.prepare
     * @param {Object} userSettings
     * @param {Array}  userSettings.tools       list of plugins
     * @param {String} userSettings.holderId    Element's id to append editor
     *
     * Load user defined tools
     * Tools must contain this important objects :
     *  @param {String} type - this is a type of plugin. It can be used as plugin name
     *  @param {String} iconClassname - this a icon in toolbar
     *  @param {Object} make - what should plugin do, when it is clicked
     *  @param {Object} appendCallback - callback after clicking
     *  @param {Element} settings - what settings does it have
     *  @param {Object} render - plugin get JSON, and should return HTML
     *  @param {Object} save - plugin gets HTML content, returns JSON
     *  @param {Boolean} displayInToolbox - will be displayed in toolbox. Default value is TRUE
     *  @param {Boolean} enableLineBreaks - inserts new block or break lines. Default value is FALSE
     *
     * @example
     *   -  type             : 'header',
     *   -  iconClassname    : 'ce-icon-header',
     *   -  make             : headerTool.make,
     *   -  appendCallback   : headerTool.appendCallback,
     *   -  settings         : headerTool.makeSettings(),
     *   -  render           : headerTool.render,
     *   -  save             : headerTool.save,
     *   -  displayInToolbox : true,
     *   -  enableLineBreaks : false
     */
  self.start = function (userSettings_) {
    self.modules.core.prepare(userSettings_)

        // If all ok, make UI, bind events and parse initial-content
            .then(self.modules.ui.prepare)
            // .then(self.modules.tools.prepare)
            .then(self.modules.sanitizer.prepare)
            .then(self.modules.paste.prepare)
            .then(self.modules.transport.prepare)
            .then(self.modules.renderer.makeBlocksFromData)
            .then(self.modules.ui.saveInputs)
            .catch(function (error) {
              self.modules.core.log('Initialization failed with error: %o', 'warn', error);
            });
  };

  self.start(userSettings);

  return {save: self.modules.saver.save};
});
