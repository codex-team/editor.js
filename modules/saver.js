/**
 * Codex Editor Saver
 *
 * @author Codex Team
 * @version 1.1.0
 */

module.exports = (function () {
  let saver = {};

  let editor = this;

    /**
     * @public
     * Save blocks
     */
  saver.save = function () {
        /** Save html content of redactor to memory */
    editor.state.html = editor.nodes.redactor.innerHTML;

        /** Clean jsonOutput state */
    editor.state.jsonOutput = [];

    return saveBlocks(editor.nodes.redactor.childNodes);
  };

    /**
     * @private
     * Save each block data
     *
     * @param blocks
     * @returns {Promise.<TResult>}
     */
  let saveBlocks = function (blocks) {
    let data = [];

    for(let index = 0; index < blocks.length; index++) {
      data.push(getBlockData(blocks[index]));
    }

    return Promise.all(data)
            .then(makeOutput)
            .catch(editor.modules.core.log);
  };

    /** Save and validate block data */
  let getBlockData = function (block) {
    return saveBlockData(block)
          .then(validateBlockData)
          .catch(editor.modules.core.log);
  };

   /**
    * @private
    * Call block`s plugin save method and return saved data
    *
    * @param block
    * @returns {Object}
    */
  let saveBlockData = function (block) {
    let tool = block.childNodes[0].childNodes[0].tool;

        /** Check for plugin existence */
    if (!editor.tools[tool.name]) {
      editor.modules.core.log(`Plugin «${tool.name}» not found`, 'error');
      return {data: null, tool: null};
    }

        /** Check for plugin having save method */
    if (typeof tool.save !== 'function') {
      editor.modules.core.log(`Plugin «${tool.name}» must have save method`, 'error');
      return {data: null, tool: null};
    }

        /** Result saver */
    let blockContent   = block.childNodes[0],
        pluginsContent = blockContent.childNodes[0],
        position = pluginsContent.dataset.inputPosition;

        /** If plugin wasn't available then return data from cache */
    if ( editor.tools[tool.name].available === false ) {
      return Promise.resolve({data: codex.editor.state.blocks.items[position].data, tool});
    }

    return Promise.resolve(pluginsContent)
            .then(tool.save)
            .then(data => Object({data, tool}));
  };

   /**
    * Call plugin`s validate method. Return false if validation failed
    *
    * @param data
    * @param tool
    * @returns {Object|Boolean}
    */
  let validateBlockData = function ({data, tool}) {
    if (!data || !tool) {
      return false;
    }

    if (tool.validate && typeof tool.validate === 'function') {
      let result = tool.validate(data);

            /**
             * Do not allow invalid data
             */
      if (!result) {
        return false;
      }
    }

    return {data, tool};
  };

   /**
    * Compile article output
    *
    * @param savedData
    * @returns {{time: number, version, items: (*|Array)}}
    */
  let makeOutput = function (savedData) {
    savedData = savedData.filter(blockData => blockData);

    let items = savedData.map(blockData => Object({type: blockData.tool.name, data: blockData.data}));

    editor.state.jsonOutput = items;

    return {
      id: editor.state.blocks.id || null,
      time: +new Date(),
      version: editor.version,
      items
    };
  };

  return saver;
});
